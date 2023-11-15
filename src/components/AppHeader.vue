<script lang="ts" setup>
import { useRouter, useRoute } from 'vue-router'
import useModalStore from '@/stores/modal'
import useUserStore from '@/stores/user'
const modalStore = useModalStore()
const router = useRouter()
const route = useRoute()

const userStore = useUserStore()

const logout = async () => {
  await userStore.logout()
  if (route.meta.requiresAuth) {
    router.push({ name: 'Home' })
  }
}
</script>
<template>
  <!-- Header -->
  <header id="header" class="bg-gray-700">
    <nav class="container mx-auto flex justify-start items-center py-5 px-4">
      <!-- App Name -->
      <RouterLink
        class="text-white font-bold uppercase text-2xl mr-4"
        :to="{ name: 'Home' }"
        exact-active-class="no-active"
        >Music</RouterLink
      >

      <div class="flex flex-grow items-center">
        <!-- Primary Navigation -->
        <ul class="flex flex-row mt-1 flex-grow">
          <li>
            <RouterLink class="px-2 text-white" :to="{ name: 'About' }">About</RouterLink>
          </li>
          <!-- Navigation Links -->
          <li v-if="!userStore.userLoggedIn">
            <a
              class="px-2 text-white"
              href="#"
              @click.prevent="modalStore.isOpen = !modalStore.isOpen"
            >
              Login / Register
            </a>
          </li>
          <template v-else>
            <li>
              <RouterLink class="px-2 text-white" :to="{ name: 'Manage' }">Manage</RouterLink>
            </li>
            <li class="ml-auto">
              <a class="px-2 text-white" href="#" @click="logout">Log out</a>
            </li>
          </template>
        </ul>
      </div>
    </nav>
  </header>
</template>
