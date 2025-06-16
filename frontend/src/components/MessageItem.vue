<script setup lang="ts">
import type { Message } from '../types/message'

interface Props {
  message: Message
  isOwn: boolean
}

defineProps<Props>()

function formatTime(timestamp: string) {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function getAvatarText(username: string) {
  return username.charAt(0).toUpperCase()
}
</script>

<template>
  <div class="flex gap-3" :class="[isOwn ? 'flex-row-reverse' : 'flex-row']">
    <!-- Avatar -->
    <div class="flex-shrink-0">
      <div v-if="message.author.avatar" class="h-8 w-8 overflow-hidden rounded-full">
        <img
          :src="message.author.avatar"
          :alt="message.author.username"
          class="h-full w-full object-cover"
          @error="(e: any) => { e.target.style.display = 'none' }"
        >
      </div>
      <div
        v-else
        class="h-8 w-8 flex items-center justify-center rounded-full bg-primary-500 text-sm text-white font-medium"
      >
        {{ getAvatarText(message.author.username) }}
      </div>
    </div>

    <!-- Message Content -->
    <div class="max-w-xs flex-1 sm:max-w-md" :class="[isOwn ? 'text-right' : 'text-left']">
      <!-- Username and timestamp -->
      <div class="mb-1 flex items-center gap-2" :class="[isOwn ? 'justify-end' : 'justify-start']">
        <span class="text-sm text-neutral-700 font-medium">
          {{ isOwn ? 'You' : message.author.username }}
        </span>
        <span class="text-xs text-neutral-500">
          {{ formatTime(message.createdAt) }}
        </span>
      </div>

      <!-- Message bubble -->
      <div
        class="inline-block break-words rounded-2xl px-4 py-2" :class="[
          isOwn
            ? 'bg-primary-500 text-white rounded-br-md'
            : 'bg-white text-neutral-800 shadow-sm border border-neutral-200 rounded-bl-md',
        ]"
      >
        {{ message.content }}
      </div>
    </div>
  </div>
</template>

