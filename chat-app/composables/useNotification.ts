import { ref } from 'vue'

interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  timeout?: number
}

const notifications = ref<Notification[]>([])

export const useNotification = () => {
  const requestPermission = async () => {
    if (!('Notification' in window)) {
      console.warn('Browser does not support notifications')
      return false
    }

    if (Notification.permission === 'granted') {
      return true
    }

    const permission = await Notification.requestPermission()
    return permission === 'granted'
  }

  const showNotification = async ({
    title,
    message,
    type = 'info',
    timeout = 5000
  }: Omit<Notification, 'id'>) => {
    const id = Date.now().toString()
    const notification: Notification = {
      id,
      title,
      message,
      type,
      timeout
    }

    // Add to internal notifications
    notifications.value.push(notification)

    // Show browser notification if permission granted
    if (Notification.permission === 'granted' && document.hidden) {
      new Notification(title, {
        body: message,
        icon: '/icon.png' // Add your app icon path
      })
    }

    // Remove notification after timeout
    if (timeout > 0) {
      setTimeout(() => {
        removeNotification(id)
      }, timeout)
    }

    return id
  }

  const removeNotification = (id: string) => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index !== -1) {
      notifications.value.splice(index, 1)
    }
  }

  const clearNotifications = () => {
    notifications.value = []
  }

  return {
    notifications,
    showNotification,
    removeNotification,
    clearNotifications,
    requestPermission
  }
}

// Create composable for handling message notifications
export const useMessageNotification = () => {
  const notification = useNotification()

  const notifyNewMessage = async (sender: string, message: string) => {
    await notification.showNotification({
      title: `ข้อความใหม่จาก ${sender}`,
      message: message.length > 50 ? message.slice(0, 50) + '...' : message,
      type: 'info'
    })
  }

  return {
    notifyNewMessage
  }
}