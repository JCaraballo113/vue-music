<script lang="ts" setup>
import supabase from '@/includes/supabase'
import { ref } from 'vue'
import useUserStore from '@/stores/user'

const userStore = useUserStore()

const schema = ref({
  email: 'required|min:3|max:100|email',
  password: 'required|min:9|max:100'
})

const loggingIn = ref(false)
const loginAlert = ref(false)
const loginAlertVariant = ref('bg-blue-500')
const loginAlertMsg = ref('Please wait! We are logging you in.')

const login = async (values: any) => {
  loggingIn.value = true
  loginAlert.value = true
  loginAlertVariant.value = 'bg-blue-500'
  loginAlertMsg.value = 'Please wait! We are logging you in.'

  await userStore.login(values)

  if (userStore.authError) {
    loggingIn.value = false
    loginAlertVariant.value = 'bg-green-500'
    loginAlertMsg.value = userStore.authError
    return
  }

  loggingIn.value = false
  loginAlertVariant.value = 'bg-green-500'
  loginAlertMsg.value = 'You are logged in!'
  window.location.reload()
}
</script>
<template>
  <div
    class="text-white text-center font-bold p-4 mb-4"
    v-if="loginAlert"
    :class="loginAlertVariant"
  >
    {{ loginAlertMsg }}
  </div>
  <VeeForm :validation-schema="schema" @submit="login">
    <!-- Email -->
    <div class="mb-3">
      <label class="inline-block mb-2">Email</label>
      <VeeField
        type="email"
        name="email"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Enter Email"
      />
      <ErrorMessage class="text-red-600" name="email" />
    </div>
    <!-- Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">Password</label>
      <VeeField
        type="password"
        name="password"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Password"
      />
      <ErrorMessage class="text-red-600" name="password" />
    </div>
    <button
      type="submit"
      :disabled="loggingIn"
      class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700"
    >
      Submit
    </button>
  </VeeForm>
</template>
