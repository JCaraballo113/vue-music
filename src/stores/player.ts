import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { Howl } from 'howler'
import type { Song } from '@/types/music'
import helper from '@/includes/helper'

export default defineStore('player', () => {
  const currentSong = ref<Song>({} as Song)
  const sound = ref<Howl>({} as Howl)
  const seek = ref('00:00')
  const duration = ref('00:00')
  const playerProgress = ref('0%')

  const playing = computed(() => {
    if (!sound.value.playing) {
      return false
    }

    return sound.value.playing()
  })

  const progress = () => {
    seek.value = helper.formatTime(sound.value.seek())
    duration.value = helper.formatTime(sound.value.duration())

    playerProgress.value = `${(sound.value.seek() / sound.value.duration()) * 100}%`

    if (sound.value.playing()) {
      requestAnimationFrame(progress)
    }
  }

  const newSong = (song: Song | null) => {
    if (sound.value instanceof Howl) {
      sound.value.unload()
    }

    if (song) {
      currentSong.value = song
      sound.value = new Howl({
        src: [song.song_url],
        html5: true
      })
      sound.value.play()

      sound.value.on('play', () => {
        requestAnimationFrame(progress)
      })
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
    playing,
    seek,
    duration,
    playerProgress
  }
})
