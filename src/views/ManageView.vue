<script lang="ts" setup>
import { ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import supabase from '@/includes/supabase'
import MusicUpload from '@/components/MusicUpload.vue'
import CompositionItem from '@/components/CompositionItem.vue'
import { type Song } from '@/types/music'

const fetchSongs: () => Promise<Song[] | null> = async () => {
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
  if (sessionData && sessionData.session && !sessionError) {
    const { session } = sessionData
    const { data: songData, error: songLoadError } = await supabase
      .from('songs')
      .select('*')
      .eq('user_id', session.user.id)
    if (!songLoadError) {
      return songData ?? ([] as Song[])
    } else {
      throw new Error(songLoadError.message)
    }
  } else if (sessionError) {
    throw new Error(sessionError.message)
  }

  return null
}

const {
  isPending,
  isFetching,
  isError,
  data: songs,
  error
} = useQuery<Song[] | null>({
  queryKey: ['songs'],
  queryFn: fetchSongs
})
</script>
<template>
  <!-- Main Content -->
  <section class="container mx-auto mt-6">
    <div class="md:grid md:grid-cols-3 md:gap-4">
      <div class="col-span-1">
        <MusicUpload />
      </div>
      <div class="col-span-2">
        <div class="bg-white rounded border border-gray-200 relative flex flex-col">
          <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
            <span class="card-title">My Songs</span>
            <i class="fa fa-compact-disc float-right text-green-400 text-2xl"></i>
          </div>
          <div class="p-6" v-for="song in songs" :key="song.id">
            <!-- Composition Items -->
            <CompositionItem :song="song" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped></style>
