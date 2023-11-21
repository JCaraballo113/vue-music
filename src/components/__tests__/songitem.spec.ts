import { test, describe, expect } from 'vitest'
import { shallowMount, RouterLinkStub } from '@vue/test-utils'
import SongItem from '../SongItem.vue'

describe('SongItem.vue', () => {
  test('renders song.display_name', () => {
    const song = {
      display_name: 'test',
      comment_count: 0,
      genre: 'pop',
      id: 1,
      modified_name: 'test',
      original_name: 'test',
      user_id: 'test_id',
      song_url: 'test_url'
    }
    const wrapper = shallowMount(SongItem, {
      props: {
        song
      },
      global: {
        stubs: {
          RouterLink: RouterLinkStub
        }
      }
    })

    const compositionAuthor = wrapper.find('.text-gray-500')

    expect(compositionAuthor.text()).toBe(song.display_name)
  })
})
