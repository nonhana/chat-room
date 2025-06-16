<script setup lang="ts">
import type { User } from '../types/auth'
import { ref } from 'vue'

interface Props {
  user: User
}

interface Emits {
  logout: []
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const isDropdownOpen = ref(false)

function toggleDropdown() {
  isDropdownOpen.value = !isDropdownOpen.value
}

function handleLogout() {
  emit('logout')
  isDropdownOpen.value = false
}

function getAvatarText(username: string) {
  return username.charAt(0).toUpperCase()
}

// Close dropdown when clicking outside
function closeDropdown() {
  isDropdownOpen.value = false
}
</script>

<template>
  <div class="relative">
    <!-- User Avatar Button -->
    <button
      class="flex items-center rounded-lg p-2 transition-colors space-x-2 hover:bg-neutral-100"
      @click="toggleDropdown"
    >
      <div v-if="user.avatar" class="h-8 w-8 overflow-hidden rounded-full">
        <img
          :src="user.avatar"
          :alt="user.username"
          class="h-full w-full object-cover"
          @error="(e: any) => { e.target.style.display = 'none' }"
        >
      </div>
      <div
        v-else
        class="h-8 w-8 flex items-center justify-center rounded-full bg-primary-500 text-sm text-white font-medium"
      >
        {{ getAvatarText(user.username) }}
      </div>

      <span class="text-sm text-neutral-700 font-medium hidden sm:block">
        {{ user.username }}
      </span>

      <div class="i-carbon-chevron-down text-sm text-neutral-500 transition-transform" :class="{ 'rotate-180': isDropdownOpen }" />
    </button>

    <!-- Dropdown Menu -->
    <div
      v-if="isDropdownOpen"
      class="absolute right-0 z-50 mt-2 w-48 border border-neutral-200 rounded-lg bg-white py-2 shadow-lg"
      @click.stop
    >
      <div class="border-b border-neutral-100 px-4 py-2">
        <p class="text-sm text-neutral-900 font-medium">
          {{ user.username }}
        </p>
        <p class="text-xs text-neutral-500">
          Joined {{ new Date(user.createdAt).toLocaleDateString() }}
        </p>
      </div>

      <button
        class="w-full flex items-center px-4 py-2 text-left text-sm text-error-600 transition-colors space-x-2 hover:bg-error-50"
        @click="handleLogout"
      >
        <div class="i-carbon-logout" />
        <span>Sign Out</span>
      </button>
    </div>

    <!-- Backdrop -->
    <div
      v-if="isDropdownOpen"
      class="fixed inset-0 z-40"
      @click="closeDropdown"
    />
  </div>
</template>
