<script setup lang="ts">
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
</script>

<template>
  <div
    v-if="authStore.tabId"
    class="border border-neutral-200 rounded-lg bg-neutral-50 p-3 text-xs text-neutral-600"
  >
    <div class="mb-1 font-medium">
      Tab Info (Debug)
    </div>
    <div class="space-y-1">
      <div><strong>Tab ID:</strong> {{ authStore.tabId }}</div>
      <div><strong>Logged in:</strong> {{ authStore.isAuthenticated ? 'Yes' : 'No' }}</div>
      <div v-if="authStore.user">
        <strong>User:</strong> {{ authStore.user.username }}
      </div>
    </div>
  </div>
</template>
