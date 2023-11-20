<template>
  <section class="w-full mb-8 py-14 text-center text-white relative">
    <div
      class="absolute inset-0 w-full h-full box-border bg-contain music-bg"
      style="background-image: url(/assets/img/song-header.png)"
    ></div>
    <div class="container mx-auto flex items-center">
      <!-- Play/Pause Button -->
      <button
        type="button"
        class="z-50 h-24 w-24 text-3xl bg-white text-black rounded-full focus:outline-none"
        @click="newSong(song)"
      >
        <i class="fas" :class="{ 'fa-play': !playing, 'fa-pause': playing }"></i>
      </button>
      <div class="z-50 text-left ml-8">
        <!-- Song Info -->
        <div class="text-3xl font-bold">{{ song?.modified_name }}</div>
        <div>{{ song?.genre }}</div>
      </div>
    </div>
  </section>
  <!-- Form -->
  <section class="container mx-auto mt-6">
    <div class="bg-white rounded border border-gray-200 relative flex flex-col">
      <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
        <!-- Comment Count -->
        <span class="card-title">Comments ({{ song?.comment_count ?? 0 }})</span>
        <i class="fa fa-comments float-right text-green-400 text-2xl"></i>
      </div>
      <div class="p-6">
        <div
          class="text-white text-center font-bold p-4 mb-4"
          v-if="commentFormState.showAlert"
          :class="commentFormState.alertVariant"
        >
          {{ commentFormState.alertMessage }}
        </div>
        <VeeForm :validation-schema="schema" @submit="submitComment">
          <VeeField
            as="textarea"
            name="comment"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded mb-4"
            placeholder="Your comment here..."
          ></VeeField>
          <ErrorMessage name="comment" class="text-red-600" />
          <button
            type="submit"
            class="py-1.5 px-3 rounded text-white bg-green-600 block"
            :disabled="commentFormState.inSubmission"
          >
            Submit
          </button>
        </VeeForm>
        <!-- Sort Comments -->
        <select
          class="block mt-4 py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          v-model.number="sortBy"
        >
          <option value="1">Latest</option>
          <option value="2">Oldest</option>
        </select>
      </div>
    </div>
  </section>
  <!-- Comments -->
  <ul class="container mx-auto" v-if="sortedComments.length > 0">
    <li
      class="p-6 bg-gray-50 border border-gray-200"
      v-for="comment in sortedComments"
      :key="comment.id"
    >
      <!-- Comment Author -->
      <div class="mb-5">
        <div class="font-bold">{{ comment.users?.name }}</div>
        <time
          >{{
            Math.floor((Date.now() - new Date(comment.created_at).getTime()) / (1000 * 60)) > 0
              ? Math.floor((Date.now() - new Date(comment.created_at).getTime()) / (1000 * 60))
              : 0
          }}
          minutes ago</time
        >
      </div>

      <p>
        {{ comment.comment }}
      </p>
    </li>
  </ul>
  <p v-else class="container mx-auto">No comments on song</p>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { computed, onBeforeMount, ref, reactive, watch } from 'vue'
import type { Song, SongComment } from '@/types/music'
import usePlayerStore from '@/stores/player'
import supabase from '@/includes/supabase'
import { storeToRefs } from 'pinia'

const playerStore = usePlayerStore()
const { newSong } = playerStore
const { playing } = storeToRefs(playerStore)

const route = useRoute()
const router = useRouter()
const song = ref<Song | null>(null)
const comments = ref<SongComment[]>([])
const { sort }: any = route.query
const sortBy = ref<number>(sort === '1' || sort === '2' ? Number(sort) : 1)
const commentFormState = reactive({
  showAlert: false,
  inSubmission: false,
  alertVariant: 'bg-blue-500',
  alertMessage: ''
})

const ascending = computed(() => sortBy.value !== 1)

watch(sortBy, () => router.push({ query: { sort: sortBy.value } }))

const sortedComments = computed(() => {
  return comments.value.slice().sort((a, b) => {
    if (ascending.value) {
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    } else {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    }
  })
})

const schema = ref({
  comment: 'required|min:3'
})

const loadCommentsForSong = async (songId: number) => {
  const { data, error: loadCommentsError } = await supabase
    .from('songs_comments')
    .select('*, users (name)')
    .eq('song_id', songId)
    .order('created_at', { ascending: ascending.value })
  if (loadCommentsError) {
    console.error(loadCommentsError)
  } else {
    comments.value = data
  }
}

const submitComment = async ({ comment }: { comment: string }, { resetForm }: any) => {
  const { data, error: loadSessionError } = await supabase.auth.getSession()
  if (loadSessionError) {
    router.push({ name: 'Home' })
    return
  }

  const { session } = data
  if (!session) {
    router.push({ name: 'Home' })
    return
  }
  const { user } = session

  commentFormState.inSubmission = true
  commentFormState.showAlert = true
  commentFormState.alertVariant = 'bg-blue-500'
  commentFormState.alertMessage = 'Please wait! Your comment is being submitted...'

  if (song.value) {
    const { data: newComment, error: insertCommentError } = await supabase
      .from('songs_comments')
      .insert({ song_id: song.value.id, user_id: user.id, comment })
      .select('*, users (name)')
      .single()

    if (insertCommentError) {
      commentFormState.inSubmission = false
      commentFormState.alertVariant = 'bg-red-500'
      commentFormState.alertMessage = 'There was an error submitting your comment.'
      return
    }

    if (newComment && song.value) {
      comments.value.push(newComment)
      const { data } = await supabase
        .from('songs')
        .update({ id: song.value.id, comment_count: song.value.comment_count + 1 })
        .eq('id', song.value.id)
        .select('*')
        .single()

      if (data) {
        song.value = data
        commentFormState.inSubmission = false
        commentFormState.alertVariant = 'bg-green-500'
        commentFormState.alertMessage = 'Your comment has been submitted successfully.'
        resetForm()
      }
    }
  }
}

onBeforeMount(async () => {
  const { data, error: loadSongError } = await supabase
    .from('songs')
    .select('*')
    .eq('id', route.params.id || 0)
    .single()
  if (loadSongError) {
    router.push({ name: 'Home' })
    return
  } else {
    song.value = data
    loadCommentsForSong(song.value.id)
  }
})
</script>

<style scoped></style>
