// // composables/useChat.ts
// import { io } from 'socket.io-client'
// import { ref, onMounted, onUnmounted } from 'vue'

// export const useChat = () => {
//   const socket = ref(null)
//   const messages = ref([])
//   const users = ref([])

//   const initializeSocket = () => {
//     socket.value = io(process.env.NUXT_PUBLIC_SOCKET_URL, {
//       auth: {
//         token: localStorage.getItem('token')
//       }
//     })

//     socket.value.on('message:received', (message) => {
//       messages.value.push(message)
//     })

//     socket.value.on('users:update', (updatedUsers) => {
//       users.value = updatedUsers
//     })
//   }

//   const sendMessage = (message) => {
//     if (socket.value && socket.value.connected) {
//       socket.value.emit('message:send', message)
//     }
//   }

//   onMounted(() => {
//     initializeSocket()
//   })

//   onUnmounted(() => {
//     if (socket.value) {
//       socket.value.disconnect()
//     }
//   })

//   return {
//     messages,
//     users,
//     sendMessage
//   }
// }