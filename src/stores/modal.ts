import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export default defineStore('modal', () => {
  const isOpen = ref(false)
  const hiddenClass = computed(() => (!isOpen.value ? 'hidden' : ''))
  return {
    isOpen,
    hiddenClass
  }
})
