import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'
import supabase from '@/includes/supabase'

export interface RegisterCredentials {
  email: string
  password: string
  name: string
  age: number
  country: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export default defineStore('user', () => {
  const userLoggedIn = ref(false)
  const authError = ref<string | null>(null)

  const register = async (values: RegisterCredentials) => {
    authError.value = null
    const { error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password
    })

    if (error) {
      authError.value = error.message
      return
    }

    const newUser = {
      email: values.email,
      name: values.name,
      age: values.age,
      country: values.country
    }

    const { error: insertError } = await supabase.from('users').insert(newUser)

    if (insertError) {
      authError.value = insertError.message
      return
    }

    userLoggedIn.value = true
  }
  const login = async (values: LoginCredentials) => {
    authError.value = null
    const { data: userData, error: loginError } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password
    })
    console.log(userData, loginError)

    if (loginError) {
      userLoggedIn.value = false
      authError.value = loginError.message
      return
    }

    userLoggedIn.value = true
  }

  const logout = async () => {
    authError.value = null
    const { error: logoutError } = await supabase.auth.signOut()
    if (logoutError) {
      authError.value = logoutError.message
      return
    }
    userLoggedIn.value = false
  }

  return {
    userLoggedIn,
    register,
    login,
    logout,
    authError
  }
})
