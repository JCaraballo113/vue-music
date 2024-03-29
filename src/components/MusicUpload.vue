<template>
  <div class="bg-white rounded border border-gray-200 relative flex flex-col">
    <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
      <span class="card-title">Upload</span>
      <i class="fas fa-upload float-right text-green-400 text-2xl"></i>
    </div>
    <div class="p-6">
      <!-- Upload Dropbox -->
      <div
        class="w-full px-10 py-20 rounded text-center cursor-pointer border border-dashed border-gray-400 text-gray-400 transition duration-500 hover:text-white hover:bg-green-400 hover:border-green-400 hover:border-solid"
        :class="{ 'bg-green-400 border-green-400 border-solid': isDragOver }"
        @drag.prevent.stop=""
        @dragstart.prevent.stop=""
        @dragend.prevent.stop="isDragOver = false"
        @dragover.prevent.stop="isDragOver = true"
        @dragenter.prevent.stop="isDragOver = true"
        @dragleave.prevent.stop="isDragOver = false"
        @drop.prevent.stop="upload($event)"
      >
        <h5>Drop your files here</h5>
      </div>
      <input type="file" multiple @change="upload($event)" />
      <hr class="my-6" />
      <!-- Progess Bars -->
      <div class="mb-4" v-for="upload in uploads" :key="upload.name">
        <!-- File Name -->
        <div class="font-bold text-sm" :class="upload.uploadTextClass">
          <i :class="upload.icon" />
          {{ upload.name }}
        </div>
        <div class="flex h-4 overflow-hidden bg-gray-200 rounded">
          <!-- Inner Progress Bar -->
          <div
            class="transition-all progress-bar bg-blue-400"
            :class="upload.uploadVariant"
            :style="{ width: `${upload.progress}%` }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount, watch } from 'vue'
import supabase from '@/includes/supabase'
import * as tus from 'tus-js-client'
import { uploadWithProgress, type FileUploadResponse } from '@/includes/upload'

type Upload = {
  name: string
  progress: number
  uploadVariant: string
  uploadTextClass: string
  icon: string
  error: string | null
  upload: tus.Upload
  complete: boolean
}

const emit = defineEmits(['songUploaded'])

const isDragOver = ref(false)
const uploads = ref<Upload[]>([])

onBeforeUnmount(() => {
  for (const { upload } of uploads.value) {
    upload.abort().catch(() => {
      console.log('abort error')
    })
  }
})

watch(
  uploads,
  () => {
    const allComplete = uploads.value.every((upload) => upload.complete)
    if (allComplete) {
      setTimeout(() => {
        uploads.value = []
      }, 2000)
    }
  },
  {
    deep: true
  }
)

const getCurrentUpload = (fileName: string): Upload | undefined => {
  const currentUpload = uploads.value.find((u) => u.name === fileName)

  return currentUpload
}

const upload = async (event: any) => {
  isDragOver.value = false
  const files = event.dataTransfer
    ? [...(event.dataTransfer?.files ?? [])]
    : [...event.target.files]

  files.forEach(async (file) => {
    if (file.type !== 'audio/mpeg') {
      return
    }

    const { data } = await supabase.auth.getSession()
    const { session } = data
    const upload = uploadWithProgress(
      {
        file,
        bucketName: 'songs',
        objectName: `${session?.user.id}/${file.name}`,
        accessToken: session?.access_token
      },
      (bytesUploaded: number, bytesTotal: number) => {
        const percentage = (bytesUploaded / bytesTotal) * 100

        const currentUpload = getCurrentUpload(file.name)
        if (currentUpload) {
          currentUpload.progress = percentage
        }
      },
      async (response: FileUploadResponse) => {
        const song: any = {
          display_name: 'bensound',
          original_name: response.fileName,
          modified_name: response.fileName,
          genre: '',
          comment_count: 0,
          song_url: response.song_url
        }
        const currentUpload = getCurrentUpload(response.fileName)
        if (currentUpload) {
          currentUpload.uploadVariant = 'bg-green-400'
          currentUpload.icon = 'fas fa-check'
          currentUpload.uploadTextClass = 'text-green-400'
          currentUpload.complete = true
        }
        const { error } = await supabase.from('songs').insert(song)
        if (error && currentUpload) {
          currentUpload.uploadVariant = 'bg-red-400'
          currentUpload.icon = 'fas fa-times'
          currentUpload.uploadTextClass = 'text-red-400'
          currentUpload.error = error.message
        }
        emit('songUploaded')
      },
      (error: FileUploadResponse) => {
        const currentUpload = getCurrentUpload(error.fileName)
        if (currentUpload) {
          currentUpload.uploadVariant = 'bg-red-400'
          currentUpload.icon = 'fas fa-times'
          currentUpload.uploadTextClass = 'text-red-400'
          currentUpload.error = error.message
        }
      }
    )
    uploads.value.push({
      name: file.name,
      progress: 0,
      error: null,
      uploadVariant: 'bg-blue-400',
      icon: 'fas fa-spinner fa-spin',
      uploadTextClass: '',
      upload,
      complete: false
    })
  })
}
</script>

<style scoped></style>
