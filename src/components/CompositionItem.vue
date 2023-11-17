<template>
  <div class="border border-gray-200 p-3 mb-4 rounded">
    <div v-show="!showSongForm">
      <h4 class="inline-block text-2xl font-bold">{{ song.display_name }}</h4>
      <button class="ml-1 py-1 px-2 text-sm rounded text-white bg-red-600 float-right">
        <i class="fa fa-times"></i>
      </button>
      <button
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-blue-600 float-right"
        @click.prevent="showSongForm = !showSongForm"
      >
        <i class="fa fa-pencil-alt"></i>
      </button>
    </div>
    <div v-show="showSongForm">
      <VeeForm :validation-schema="schema" @submit="submitForm">
        <div class="mb-3">
          <label class="inline-block mb-2">Song Title</label>
          <VeeField
            type="text"
            name="title"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Enter Song Title"
          />
          <ErrorMessage class="text-red-600" name="title" />
        </div>
        <div class="mb-3">
          <label class="inline-block mb-2">Genre</label>
          <VeeField
            type="text"
            name="genre"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Enter Genre"
          />
          <ErrorMessage class="text-red-600" name="genre" />
        </div>
        <button type="submit" class="py-1.5 px-3 rounded text-white bg-green-600">Submit</button>
        <button
          @click.prevent="showSongForm = false"
          type="button"
          class="py-1.5 px-3 rounded text-white bg-gray-600 ml-4"
        >
          Cancel
        </button>
      </VeeForm>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { type Song } from '@/types/music'

type SongUpdates = {
  title: string
  genre: string | null
}
defineProps({
  song: {
    type: Object as () => Song,
    required: true
  }
})

const schema = ref({
  title: 'required|min:3|max:100',
  genre: 'min:3|max:100'
})

const showSongForm = ref(false)
</script>

<style scoped></style>
