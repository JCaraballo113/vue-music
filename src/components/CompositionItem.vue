<template>
  <div class="border border-gray-200 p-3 mb-4 rounded">
    <div v-show="!showSongForm">
      <h4 class="inline-block text-2xl font-bold">{{ song.modified_name }}</h4>
      <button
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-red-600 float-right"
        @click.prevent="deleteSong"
      >
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
      <div
        class="text-white text-center font-bold p-4 mb-4"
        :class="form.alertVariant"
        v-if="form.showAlert"
      >
        {{ form.alertMessage }}
      </div>
      <VeeForm :validation-schema="schema" @submit="updateSong">
        <div class="mb-3">
          <label class="inline-block mb-2">Song Title</label>
          <VeeField
            type="text"
            name="modified_name"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Enter Song Title"
            @input="updateFlag(true)"
          />
          <ErrorMessage class="text-red-600" name="modified_name" />
        </div>
        <div class="mb-3">
          <label class="inline-block mb-2">Genre</label>
          <VeeField
            type="text"
            name="genre"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Enter Genre"
            @input="updateFlag(true)"
          />
          <ErrorMessage class="text-red-600" name="genre" />
        </div>
        <button
          type="submit"
          class="py-1.5 px-3 rounded text-white bg-green-600"
          :disabled="form.inSubmission"
        >
          Submit
        </button>
        <button
          @click.prevent="showSongForm = false"
          type="button"
          :disabled="form.inSubmission"
          class="py-1.5 px-3 rounded text-white bg-gray-600 ml-4"
        >
          Cancel
        </button>
      </VeeForm>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { type Song, type SongUpdates } from '@/types/music'
import supabase from '@/includes/supabase'

const props = defineProps({
  song: {
    type: Object as () => Song,
    required: true
  },
  index: {
    type: Number,
    required: true
  },
  updateSong: {
    type: Function,
    required: true
  },
  removeSong: {
    type: Function,
    required: true
  },
  updateFlag: {
    type: Function,
    required: true
  }
})

const schema = ref({
  modified_name: 'required',
  genre: 'alpha_spaces'
})
const form = reactive({
  inSubmission: false,
  showAlert: false,
  alertVariant: 'bg-blue-500',
  alertMessage: 'Please wait! Updating song'
})
const showSongForm = ref(false)

const updateSong = async (songUpdates: SongUpdates) => {
  form.inSubmission = true
  form.showAlert = true
  form.alertVariant = 'bg-blue-500'
  form.alertMessage = 'Please wait! Updating song'

  const { error } = await supabase.from('songs').update(songUpdates).eq('id', props.song.id)

  form.inSubmission = false
  if (error) {
    form.alertVariant = 'bg-red-500'
    form.alertMessage = error.message
    return
  }
  form.alertVariant = 'bg-green-500'
  form.alertMessage = 'Song updated successfully!'
  props.updateSong(props.index, songUpdates)
  props.updateFlag(false)
}

const deleteSong = async () => {
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
  if (!sessionError && sessionData.session) {
    const { session } = sessionData
    const { user } = session
    const { error: fileDeleteError } = await supabase.storage
      .from('songs')
      .remove([`${user.id}/${props.song.original_name}`])

    if (!fileDeleteError) {
      const { error: songDeleteError } = await supabase
        .from('songs')
        .delete()
        .eq('id', props.song.id)

      if (!songDeleteError) {
        props.removeSong(props.index)
      }
    }
  }
}
</script>

<style scoped></style>
