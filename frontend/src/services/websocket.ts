import type { WebSocketMessage } from '../types/message'
import { computed, ref } from 'vue'

/**
 * WebSocket connection state
 */
const socket = ref<WebSocket | null>(null)
const isConnected = ref(false)
const isConnecting = ref(false)

/**
 * Get current tab's auth token
 */
function getCurrentTabToken(): string | null {
  const tabId = sessionStorage.getItem('tabId')
  if (!tabId)
    return null

  return localStorage.getItem(`auth_token_${tabId}`)
}

/**
 * WebSocket service for real-time communication
 */
export function useWebSocket() {
  const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'
  const WS_URL = API_BASE_URL.replace(/^http/, 'ws')

  /**
   * Connect to WebSocket server
   */
  const connect = (token?: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (socket.value?.readyState === WebSocket.OPEN) {
        resolve()
        return
      }

      if (isConnecting.value) {
        reject(new Error('Already connecting'))
        return
      }

      // Use provided token or get from current tab
      const authToken = token || getCurrentTabToken()
      if (!authToken) {
        reject(new Error('No authentication token available'))
        return
      }

      isConnecting.value = true

      try {
        const wsUrl = `${WS_URL}/ws?token=${encodeURIComponent(authToken)}`
        socket.value = new WebSocket(wsUrl)

        socket.value.onopen = () => {
          isConnected.value = true
          isConnecting.value = false
          console.log('WebSocket connected')
          resolve()
        }

        socket.value.onclose = () => {
          isConnected.value = false
          isConnecting.value = false
          socket.value = null
          console.log('WebSocket disconnected')
        }

        socket.value.onerror = (error) => {
          console.error('WebSocket error:', error)
          isConnecting.value = false
          reject(error)
        }

        socket.value.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data)
            // Dispatch message to be handled by the message store
            window.dispatchEvent(new CustomEvent('websocket-message', { detail: message }))
          }
          catch (error) {
            console.error('Failed to parse WebSocket message:', error)
          }
        }
      }
      catch (error) {
        isConnecting.value = false
        reject(error)
      }
    })
  }

  /**
   * Disconnect from WebSocket server
   */
  const disconnect = () => {
    if (socket.value) {
      socket.value.close()
      socket.value = null
    }
    isConnected.value = false
    isConnecting.value = false
  }

  /**
   * Send message through WebSocket
   */
  const sendMessage = (content: string) => {
    if (!socket.value || socket.value.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket is not connected')
    }

    const message: WebSocketMessage = {
      type: 'chat',
      content,
    }

    socket.value.send(JSON.stringify(message))
  }

  /**
   * Send typing indicator
   */
  const sendTyping = (isTyping: boolean) => {
    if (!socket.value || socket.value.readyState !== WebSocket.OPEN) {
      return
    }

    const message: WebSocketMessage = {
      type: 'typing',
      isTyping,
    }

    socket.value.send(JSON.stringify(message))
  }

  return {
    socket: computed(() => socket.value),
    isConnected: computed(() => isConnected.value),
    isConnecting: computed(() => isConnecting.value),
    connect,
    disconnect,
    sendMessage,
    sendTyping,
  }
}
