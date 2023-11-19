import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { Howl } from 'howler'
import type { Song } from '@/types/music'

export default defineStore('player', () => {
  const currentSong = ref<Song>({} as Song)
  const sound = ref<Howl>({} as Howl)
  const playing = computed(() => {
    if (!sound.value.playing) {
      return false
    }

    return sound.value.playing()
  })
  const newSong = (song: Song | null) => {
    if (song) {
      currentSong.value = song
      sound.value = new Howl({
        src: [song.song_url],
        html5: true
      })
      sound.value.play()
    }
  }

  const toggleAudio = async () => {
    if (!sound.value.playing) {
      return
    }

    if (sound.value.playing()) {
      sound.value.pause()
    } else {
      sound.value.play()
    }
  }
  return {
    currentSong,
    newSong,
    sound,
    toggleAudio,
    playing
  }
})
