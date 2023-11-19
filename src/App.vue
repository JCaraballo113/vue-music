<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import AppHeader from './components/AppHeader.vue'
import AppAuth from './components/AppAuth.vue'
import MusicPlayer from './components/MusicPlayer.vue'
import useUserStore from '@/stores/user'
import supabase from '@/includes/supabase'

const userStore = useUserStore()

onMounted(async () => {
  const { data } = await supabase.auth.getSession()

  if (data.session) {
    userStore.userLoggedIn = true
  }
})
</script>

<template>
  <AppHeader />

  <RouterView />

  <MusicPlayer />

  <AppAuth />
</template>
