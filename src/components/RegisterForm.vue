<script lang="ts" setup>
import { ref } from 'vue'
import useUserStore from '@/stores/user'

const userStore = useUserStore()

const registerSchema = ref({
  name: 'required|min:3|max:100|alpha_spaces',
  email: 'required|min:3|max:100|email',
  age: 'required|min_value:18|max_value:100',
  password: 'required|min:9|max:100|excluded:password',
  confirmPassword: 'passwords_mismatch:@password',
  country: 'required|country_excluded:Antartica',
  tos: 'required'
})

const userData = ref({
  country: 'USA'
})

const registering = ref(false)
const registerAlert = ref(false)
const regAlertVariant = ref('bg-blue-500')
const regAlertMsg = ref('Please wait! Your account is being created.')

const register = async (values: any) => {
  try {
    registerAlert.value = true
    registering.value = true
    regAlertVariant.value = 'bg-blue-500'
    regAlertMsg.value = 'Please wait! Your account is being created.'

    await userStore.register(values)

    if (userStore.authError) {
      regAlertVariant.value = 'bg-red-500'
      regAlertMsg.value = userStore.authError
      return
    }

    regAlertVariant.value = 'bg-green-500'
    regAlertMsg.value = 'Success! Your account has been created.'
    window.location.reload()
  } catch (error: any) {
    registering.value = false
    regAlertVariant.value = 'bg-red-500'
    regAlertMsg.value = error.message
    return
  }
}
</script>

<template>
  <div
    class="text-white text-center font-bold p-4 rouded mb-4"
    v-if="registerAlert"
    :class="regAlertVariant"
  >
    {{ regAlertMsg }}
  </div>
  <VeeForm :initialValues="userData" :validation-schema="registerSchema" @submit="register">
    <!-- Name -->
    <div class="mb-3">
      <label class="inline-block mb-2">Name</label>
      <VeeField
        name="name"
        type="text"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Enter Name"
      />
      <ErrorMessage class="text-red-600" name="name" />
    </div>
    <!-- Email -->
    <div class="mb-3">
      <label class="inline-block mb-2">Email</label>
      <VeeField
        name="email"
        type="email"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Enter Email"
      />
      <ErrorMessage class="text-red-600" name="email" />
    </div>
    <!-- Age -->
    <div class="mb-3">
      <label class="inline-block mb-2">Age</label>
      <VeeField
        name="age"
        type="number"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
      />
      <ErrorMessage class="text-red-600" name="age" />
    </div>
    <!-- Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">Password</label>
      <VeeField name="password" :bails="false" v-slot="{ field, errors }">
        <input
          type="password"
          class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          placeholder="Password"
          v-bind="field"
        />
        <div class="text-red-600" v-for="error in errors" :key="error">
          {{ error }}
        </div>
      </VeeField>
    </div>
    <!-- Confirm Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">Confirm Password</label>
      <VeeField
        name="confirmPassword"
        type="password"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Confirm Password"
      />
      <ErrorMessage class="text-red-600" name="confirmPassword" />
    </div>
    <!-- Country -->
    <div class="mb-3">
      <label class="inline-block mb-2">Country</label>
      <VeeField
        as="select"
        name="country"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
      >
        <option value="USA">USA</option>
        <option value="Mexico">Mexico</option>
        <option value="Germany">Germany</option>
      </VeeField>
      <ErrorMessage class="text-red-600" name="country" />
    </div>
    <!-- TOS -->
    <div class="mb-3 pl-6">
      <VeeField
        type="checkbox"
        name="tos"
        value="1"
        class="w-4 h-4 float-left -ml-6 mt-1 rounded"
      />
      <label class="inline-block">Accept terms of service</label>
      <ErrorMessage class="text-red-600" name="tos" />
    </div>
    <button
      type="submit"
      :disabled="registering"
      class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700"
    >
      Submit
    </button>
  </VeeForm>
</template>
