<script setup lang="ts">
import { nextTick, ref } from 'vue'

interface Props {
  disabled?: boolean
}

interface Emits {
  send: [content: string]
  typing: [isTyping: boolean]
}

defineProps<Props>()
const emit = defineEmits<Emits>()

// State
const message = ref('')
const isTyping = ref(false)
const typingTimer = ref<ReturnType<typeof setTimeout> | null>(null)

// Actions
async function handleSend() {
  const content = message.value.trim()
  if (!content)
    return

  // Send message
  emit('send', content)

  // Clear input
  message.value = ''

  // Stop typing indicator
  stopTyping()

  // Focus back to input
  await nextTick()
  // input.value?.focus()
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    handleSend()
  }
}

function handleInput() {
  if (!isTyping.value) {
    isTyping.value = true
    emit('typing', true)
  }

  // Reset typing timer
  if (typingTimer.value) {
    clearTimeout(typingTimer.value)
  }

  // Stop typing after 2 seconds of inactivity
  typingTimer.value = setTimeout(() => {
    stopTyping()
  }, 2000)
}

function stopTyping() {
  if (isTyping.value) {
    isTyping.value = false
    emit('typing', false)
  }

  if (typingTimer.value) {
    clearTimeout(typingTimer.value)
    typingTimer.value = null
  }
}
</script>

<template>
  <div class="flex items-end gap-3">
    <div class="flex-1">
      <textarea
        v-model="message"
        :disabled="disabled ?? false"
        placeholder="Type a message..."
        class="w-full resize-none border border-neutral-200 rounded-2xl bg-neutral-50 px-4 py-3 transition-colors disabled:cursor-not-allowed focus:border-transparent disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary-500 field-sizing-content"
        rows="1"
        style="min-height: 44px; max-height: 120px;"
        @keydown="handleKeydown"
        @input="handleInput"
        @blur="stopTyping"
      />
    </div>

    <button
      :disabled="disabled || !message.trim()"
      class="h-11 w-11 flex flex-shrink-0 items-center justify-center rounded-full bg-primary-500 text-white transition-colors duration-200 disabled:bg-primary-300 hover:bg-primary-600"
      @click="handleSend"
    >
      <div class="i-carbon-send text-lg" />
    </button>
  </div>
</template>