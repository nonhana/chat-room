<script setup lang="ts">
import type { User } from '../types/auth'
import type { Message } from '../types/message'
import MessageItem from './MessageItem.vue'

interface Props {
  messages: Message[]
  currentUser: User | null
}

defineProps<Props>()
</script>

<template>
  <div class="space-y-4">
    <div v-if="messages.length === 0" class="py-12 text-center">
      <div class="i-carbon-chat mb-4 text-4xl text-neutral-300" />
      <p class="text-neutral-500">
        No messages yet. Start the conversation!
      </p>
    </div>

    <MessageItem
      v-for="message in messages"
      :key="message.id"
      :message="message"
      :is-own="currentUser?.id === message.author.id"
    />
  </div>
</template>
