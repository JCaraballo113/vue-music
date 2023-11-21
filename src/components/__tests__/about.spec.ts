import { describe, test, expect } from 'vitest'
import { mount, shallowMount } from '@vue/test-utils'
import AboutView from '@/views/AboutView.vue'

describe('About.vue', () => {
  test('renders inner text', () => {
    const wrapper = shallowMount(AboutView)
    expect(wrapper.text()).toContain('about')
  })
})
