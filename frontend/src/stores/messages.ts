import type { Message, WebSocketMessage } from '../types/message'
import { defineStore } from 'pinia'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { messagesApi } from '../services/api'
import { useWebSocket } from '../services/websocket'
import { useAuthStore } from './auth'

/**
 * Messages store
 */
export const useMessageStore = defineStore('messages', () => {
  // State
  const messages = ref<Message[]>([])
  const isLoading = ref(false)
  const hasMore = ref(true)
  const typingUsers = ref<Set<string>>(new Set())

  // WebSocket service
  const { connect, disconnect, sendMessage, sendTyping, isConnected } = useWebSocket()
  const authStore = useAuthStore()

  // Actions
  const loadMessages = async (limit = 50, offset = 0) => {
    isLoading.value = true
    try {
      const response = await messagesApi.getMessages(limit, offset)

      if (offset === 0) {
        // Replace messages for initial load
        messages.value = response.messages
      }
      else {
        // Prepend for pagination (loading older messages)
        messages.value = [...response.messages, ...messages.value]
      }

      hasMore.value = response.pagination.hasMore
    }
    catch (error) {
      console.error('Failed to load messages:', error)
    }
    finally {
      isLoading.value = false
    }
  }

  const addMessage = (message: Message) => {
    // Avoid duplicates
    if (!messages.value.find(m => m.id === message.id)) {
      messages.value.push(message)
    }
  }

  const sendChatMessage = async (content: string) => {
    if (!isConnected.value) {
      throw new Error('Not connected to chat')
    }

    try {
      sendMessage(content)
    }
    catch (error) {
      console.error('Failed to send message:', error)
      throw error
    }
  }

  const startTyping = () => {
    if (isConnected.value) {
      sendTyping(true)
    }
  }

  const stopTyping = () => {
    if (isConnected.value) {
      sendTyping(false)
    }
  }

  const connectWebSocket = async () => {
    if (!authStore.token) {
      throw new Error('No authentication token')
    }

    await connect(authStore.token)
  }

  const disconnectWebSocket = () => {
    disconnect()
  }

  // Handle WebSocket messages
  const handleWebSocketMessage = (event: CustomEvent<WebSocketMessage>) => {
    const message = event.detail

    switch (message.type) {
      case 'message':
        if (message.id && message.content && message.createdAt && message.author) {
          addMessage({
            id: message.id,
            content: message.content,
            createdAt: message.createdAt,
            author: message.author,
          })
        }
        break

      case 'typing':
        if (message.username) {
          if (message.isTyping) {
            typingUsers.value.add(message.username)
          }
          else {
            typingUsers.value.delete(message.username)
          }
        }
        break

      case 'join':
        console.log(`${message.username} joined the chat`)
        break

      case 'leave':
        console.log(`${message.username} left the chat`)
        if (message.username) {
          typingUsers.value.delete(message.username)
        }
        break

      case 'error':
        console.error('WebSocket error:', message.message)
        break
    }
  }

  // Setup WebSocket message listener
  onMounted(() => {
    window.addEventListener('websocket-message', handleWebSocketMessage as EventListener)
  })

  onUnmounted(() => {
    window.removeEventListener('websocket-message', handleWebSocketMessage as EventListener)
  })

  return {
    // State
    messages: computed(() => messages.value),
    isLoading: computed(() => isLoading.value),
    hasMore: computed(() => hasMore.value),
    typingUsers: computed(() => Array.from(typingUsers.value)),
    isConnected,

    // Actions
    loadMessages,
    addMessage,
    sendChatMessage,
    startTyping,
    stopTyping,
    connectWebSocket,
    disconnectWebSocket,
  }
})
