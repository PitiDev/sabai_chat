// composables/useSocket.ts
import { io, Socket } from 'socket.io-client'
import { ref, onMounted, onUnmounted } from 'vue'

export const useSocket = () => {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()
  const socket = ref<Socket | null>(null)
  const isConnected = ref(false)

  const updateOnlineStatus = (status: boolean) => {
    if (socket.value && isConnected.value) {
      socket.value.emit('user:status', { isOnline: status });
    }
  };

  if (process.client) {
    window.addEventListener('beforeunload', () => {
      updateOnlineStatus(false);
    });
  }

  const connect = () => {
    if (!authStore.token) return

    socket.value = io(config.public.wsBase, {
      auth: {
        token: authStore.token
      }
    })

    socket.value.on('connect', () => {
      console.log('WebSocket connected')
      isConnected.value = true
      updateOnlineStatus(true)
    })

    socket.value.on('disconnect', () => {
      console.log('WebSocket disconnected')
      isConnected.value = false
    })
  }

  const disconnect = () => {
    if (socket.value) {
      socket.value.disconnect()
      socket.value = null
      isConnected.value = false
    }
  }

  // ส่ง Event ไปยัง Server
  const emit = (event: string, data: any) => {
    if (socket.value && isConnected.value) {
      socket.value.emit(event, data)
    }
  }

  // รับ Event จาก Server
  const on = (event: string, callback: (data: any) => void) => {
    if (socket.value) {
      socket.value.on(event, callback)
    }
  }

  // ทำความสะอาดเมื่อ Component ถูกทำลาย
  onUnmounted(() => {
    disconnect()
  })

  return {
    socket,
    isConnected,
    connect,
    disconnect,
    emit,
    on,
    updateOnlineStatus
  }
}