<script setup lang="ts">
import type { LoginForm } from '../types/auth'
import { reactive, ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

// Form state
const isRegistering = ref(false)
const errorMessage = ref('')

const loginForm = reactive<LoginForm>({
  username: '',
  password: '',
})

const registerForm = reactive({
  username: '',
  password: '',
  confirmPassword: '',
  avatar: '',
})

// Actions
async function handleLogin() {
  try {
    errorMessage.value = ''
    await authStore.login(loginForm)
    // Redirect will be handled by the router
    router.push('/chat')
  }
  catch (error: any) {
    errorMessage.value = error.response?.data?.error || 'Login failed'
  }
}

async function handleRegister() {
  try {
    errorMessage.value = ''

    if (registerForm.password !== registerForm.confirmPassword) {
      errorMessage.value = 'Passwords do not match'
      return
    }

    await authStore.register(registerForm)
    // Redirect will be handled by the router
    router.push('/chat')
  }
  catch (error: any) {
    errorMessage.value = error.response?.data?.error || 'Registration failed'
  }
}

function toggleMode() {
  isRegistering.value = !isRegistering.value
  errorMessage.value = ''
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center from-primary-100 to-secondary-100 bg-gradient-to-br p-4">
    <div class="max-w-md w-full">
      <!-- Logo/Header -->
      <div class="mb-8 text-center">
        <div class="mb-4 h-16 w-16 inline-flex items-center justify-center rounded-full bg-primary-500">
          <div class="i-carbon-chat text-2xl text-white" />
        </div>
        <h1 class="text-3xl text-neutral-800 font-bold">
          Chatroom
        </h1>
        <p class="mt-2 text-neutral-600">
          {{ isRegistering ? 'Create your account' : 'Welcome back!' }}
        </p>
      </div>

      <!-- Auth Form -->
      <div class="rounded-2xl bg-white p-8 shadow-lg">
        <!-- Error Message -->
        <div v-if="errorMessage" class="mb-4 border border-error-200 rounded-lg bg-error-50 p-3">
          <p class="text-sm text-error-700">
            {{ errorMessage }}
          </p>
        </div>

        <!-- Login Form -->
        <form v-if="!isRegistering" class="space-y-4" @submit.prevent="handleLogin">
          <div>
            <label class="mb-2 block text-sm text-neutral-700 font-medium">
              Username
            </label>
            <input
              v-model="loginForm.username"
              type="text"
              required
              class="w-full border border-neutral-300 rounded-lg px-4 py-3 transition-colors focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Enter your username"
            >
          </div>

          <div>
            <label class="mb-2 block text-sm text-neutral-700 font-medium">
              Password
            </label>
            <input
              v-model="loginForm.password"
              type="password"
              required
              class="w-full border border-neutral-300 rounded-lg px-4 py-3 transition-colors focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Enter your password"
            >
          </div>

          <button
            type="submit"
            :disabled="authStore.isLoading"
            class="w-full rounded-lg bg-primary-500! px-4 py-3 text-white font-medium transition-colors duration-200 disabled:bg-primary-300 hover:bg-primary-600"
          >
            {{ authStore.isLoading ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>

        <!-- Register Form -->
        <form v-else class="space-y-4" @submit.prevent="handleRegister">
          <div>
            <label class="mb-2 block text-sm text-neutral-700 font-medium">
              Username
            </label>
            <input
              v-model="registerForm.username"
              type="text"
              required
              class="w-full border border-neutral-300 rounded-lg px-4 py-3 transition-colors focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Choose a username"
            >
          </div>

          <div>
            <label class="mb-2 block text-sm text-neutral-700 font-medium">
              Password
            </label>
            <input
              v-model="registerForm.password"
              type="password"
              required
              class="w-full border border-neutral-300 rounded-lg px-4 py-3 transition-colors focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Create a password"
            >
          </div>

          <div>
            <label class="mb-2 block text-sm text-neutral-700 font-medium">
              Confirm Password
            </label>
            <input
              v-model="registerForm.confirmPassword"
              type="password"
              required
              class="w-full border border-neutral-300 rounded-lg px-4 py-3 transition-colors focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Confirm your password"
            >
          </div>

          <div>
            <label class="mb-2 block text-sm text-neutral-700 font-medium">
              Avatar URL (Optional)
            </label>
            <input
              v-model="registerForm.avatar"
              type="url"
              class="w-full border border-neutral-300 rounded-lg px-4 py-3 transition-colors focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="https://example.com/avatar.jpg"
            >
          </div>

          <button
            type="submit"
            :disabled="authStore.isLoading"
            class="w-full rounded-lg bg-primary-500 px-4 py-3 text-white font-medium transition-colors duration-200 disabled:bg-primary-300 hover:bg-primary-600"
          >
            {{ authStore.isLoading ? 'Creating account...' : 'Create Account' }}
          </button>
        </form>

        <!-- Toggle Mode -->
        <div class="mt-6 text-center">
          <button
            class="text-primary-600 font-medium transition-colors hover:text-primary-700"
            @click="toggleMode"
          >
            {{ isRegistering ? 'Already have an account? Sign in' : 'Need an account? Sign up' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>