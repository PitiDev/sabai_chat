import { defineStore } from 'pinia'
import { useApi } from '~/composables/useApi'

interface Message {
  id: string
  sender_id: string
  receiver_id: string
  content: string
  message_type: 'text' | 'file'
  file_url?: string
  is_read: boolean
  created_at: string
}

interface ChatState {
  messages: Message[]
  selectedUserId: string | null
  unreadCount: number
}

export const useChatStore = defineStore('chat', {
  state: (): ChatState => ({
    messages: [],
    selectedUserId: null,
    unreadCount: 0
  }),

  getters: {
    currentMessages: (state) => state.messages
  },

  actions: {
    async loadMessages(userId: string) {
      const api = useApi()
      const { data, error } = await api.getMessages(userId)
      
      if (error.value) throw error.value
      
      if (data.value) {
        this.messages = data.value
        this.selectedUserId = userId
      }
    },

    async sendMessage(content: string, messageType: 'text' | 'file' = 'text') {
      if (!this.selectedUserId) return

      const api = useApi()
      const { data, error } = await api.sendMessage({
        receiverId: this.selectedUserId,
        content,
        messageType
      })
      
      if (error.value) throw error.value
      
      if (data.value) {
        this.messages.push(data.value)
      }
    },

    async markAsRead(messageIds: string[]) {
      const api = useApi()
      const { error } = await api.markAsRead(messageIds)
      
      if (error.value) throw error.value
      
      // Update local messages
      this.messages = this.messages.map(msg => 
        messageIds.includes(msg.id) ? { ...msg, is_read: true } : msg
      )
    },

    async fetchUnreadCount() {
      const api = useApi()
      const { data, error } = await api.getUnreadCount()
      
      if (error.value) throw error.value
      
      if (data.value) {
        this.unreadCount = data.value.count
      }
    },

    // Socket handlers
    onMessageReceived(message: Message) {
      if (message.sender_id === this.selectedUserId || 
          message.receiver_id === this.selectedUserId) {
        this.messages.push(message)
      }
      this.unreadCount++
    }
  }
})