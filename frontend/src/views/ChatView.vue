<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import MessageInput from '../components/MessageInput.vue'
import MessageList from '../components/MessageList.vue'
import TabInfo from '../components/TabInfo.vue'
import UserInfo from '../components/UserInfo.vue'
import { useAuthStore } from '../stores/auth'
import { useMessageStore } from '../stores/messages'

const router = useRouter()

const authStore = useAuthStore()
const messageStore = useMessageStore()

// Refs
const chatContainer = ref<HTMLElement>()

// Computed
const currentUser = computed(() => authStore.user)
const messages = computed(() => messageStore.messages)
const isConnected = computed(() => messageStore.isConnected)
const typingUsers = computed(() => messageStore.typingUsers)

// Actions
async function handleSendMessage(content: string) {
  try {
    await messageStore.sendChatMessage(content)
    // Scroll to bottom after sending
    await nextTick()
    scrollToBottom()
  }
  catch (error) {
    console.error('Failed to send message:', error)
  }
}

function handleTyping(isTyping: boolean) {
  if (isTyping) {
    messageStore.startTyping()
  }
  else {
    messageStore.stopTyping()
  }
}

function scrollToBottom() {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}

function handleLogout() {
  messageStore.disconnectWebSocket()
  authStore.logout()
}

// Lifecycle
onMounted(async () => {
  try {
    // Restore auth if needed
    if (!authStore.isAuthenticated) {
      await authStore.restoreAuth()
    }

    if (!authStore.isAuthenticated) {
      router.push('/')
      return
    }

    // Load message history
    await messageStore.loadMessages()

    // Connect to WebSocket
    await messageStore.connectWebSocket()

    // Scroll to bottom
    await nextTick()
    scrollToBottom()
  }
  catch (error) {
    console.error('Failed to initialize chat:', error)
    router.push('/')
  }
})

onUnmounted(() => {
  messageStore.disconnectWebSocket()
})
</script>

<template>
  <div class="h-screen flex flex-col bg-neutral-50">
    <!-- Header -->
    <header class="border-b border-neutral-200 bg-white p-4 shadow-sm">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="h-8 w-8 flex items-center justify-center rounded-full bg-primary-500">
            <div class="i-carbon-chat text-lg text-white" />
          </div>
          <div>
            <h1 class="text-lg text-neutral-800 font-semibold">
              Chatroom
            </h1>
            <div class="flex items-center text-sm space-x-2">
              <div
                class="h-2 w-2 rounded-full" :class="[
                  isConnected ? 'bg-success-500' : 'bg-error-500',
                ]"
              />
              <span :class="isConnected ? 'text-success-600' : 'text-error-600'">
                {{ isConnected ? 'Connected' : 'Disconnected' }}
              </span>
            </div>
          </div>
        </div>

        <UserInfo v-if="currentUser" :user="currentUser" @logout="handleLogout" />
      </div>

      <!-- Tab Info (Debug) -->
      <TabInfo />
    </header>

    <!-- Messages Container -->
    <div
      ref="chatContainer"
      class="flex-1 overflow-y-auto px-4 py-6 space-y-4 scrollbar"
    >
      <MessageList :messages="messages" :current-user="currentUser" />

      <!-- Typing Indicator -->
      <div v-if="typingUsers.length > 0" class="flex animate-pulse items-center text-sm text-neutral-500 space-x-2">
        <div class="flex space-x-1">
          <div class="h-2 w-2 animate-bounce rounded-full bg-neutral-400" style="animation-delay: 0ms" />
          <div class="h-2 w-2 animate-bounce rounded-full bg-neutral-400" style="animation-delay: 150ms" />
          <div class="h-2 w-2 animate-bounce rounded-full bg-neutral-400" style="animation-delay: 300ms" />
        </div>
        <span>
          {{ typingUsers.length === 1
            ? `${typingUsers[0]} is typing...`
            : `${typingUsers.length} people are typing...`
          }}
        </span>
      </div>
    </div>

    <!-- Message Input -->
    <div class="border-t border-neutral-200 bg-white p-4">
      <MessageInput
        :disabled="!isConnected"
        @send="handleSendMessage"
        @typing="handleTyping"
      />
    </div>
  </div>
</template>
