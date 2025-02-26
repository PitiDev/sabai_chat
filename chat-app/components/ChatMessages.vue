<template>
    <div class="flex-1 flex flex-col bg-gray-50">
      <!-- Chat Header -->
      <div class="bg-white border-b px-6 py-4">
        <div class="flex items-center space-x-4">
          <div class="relative">
            <div class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              <span class="text-gray-600 font-medium">
                {{ selectedUser?.name.charAt(0).toUpperCase() }}
              </span>
            </div>
            <div
              v-if="selectedUser?.online"
              class="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white"
            ></div>
          </div>
          <div>
            <h2 class="text-lg font-medium text-gray-900">
              {{ selectedUser?.name }}
            </h2>
            <p class="text-sm text-gray-500">
              {{ selectedUser?.online ? 'ออนไลน์' : 'ออฟไลน์' }}
            </p>
          </div>
        </div>
      </div>
  
      <!-- Messages -->
      <div 
        ref="messagesContainer"
        class="flex-1 overflow-y-auto p-6 space-y-4"
      >
        <template v-if="messages.length">
          <div
            v-for="message in messages"
            :key="message.id"
            class="flex"
            :class="[
              message.sender_id === currentUser.id ? 'justify-end' : 'justify-start',
            ]"
          >
            <!-- Message Bubble -->
            <div
              class="max-w-[70%] rounded-lg px-4 py-2 shadow-sm"
              :class="[
                message.sender_id === currentUser.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-900'
              ]"
            >
              <!-- Text Message -->
              <div v-if="message.message_type === 'text'">
                {{ message.content }}
              </div>
  
              <!-- File Message -->
              <div v-else-if="message.message_type === 'file'" class="space-y-2">
                <div class="flex items-center space-x-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <a
                    :href="message.file_url"
                    target="_blank"
                    class="underline"
                    :class="message.sender_id === currentUser.id ? 'text-white' : 'text-blue-500'"
                  >
                    {{ message.content }}
                  </a>
                </div>
              </div>
  
              <!-- Timestamp -->
              <div 
                class="text-xs mt-1"
                :class="message.sender_id === currentUser.id ? 'text-blue-100' : 'text-gray-500'"
              >
                {{ formatTime(message.created_at) }}
              </div>
            </div>
          </div>
        </template>
        <div v-else class="flex items-center justify-center h-full text-gray-500">
          ยังไม่มีข้อความ
        </div>
      </div>
  
      <!-- Message Input -->
      <div class="bg-white border-t p-4">
        <form @submit.prevent="sendMessage" class="flex items-center space-x-2">
          <!-- File Upload -->
          <label class="p-2 text-gray-500 hover:text-gray-700 cursor-pointer">
            <input
              type="file"
              class="hidden"
              @change="handleFileUpload"
              accept="image/*,.pdf,.doc,.docx"
            />
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </label>
  
          <!-- Text Input -->
          <input
            v-model="newMessage"
            type="text"
            placeholder="พิมพ์ข้อความ..."
            class="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            @keydown.enter.prevent="sendMessage"
          />
  
          <!-- Send Button -->
          <button
            type="submit"
            class="p-2 text-blue-500 hover:text-blue-600"
            :disabled="!newMessage.trim() && !selectedFile"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, watch, onMounted, nextTick } from 'vue';

  interface Message {
    id: string;
    sender_id: string;
    receiver_id: string;
    content: string;
    message_type: 'text' | 'file';
    file_url?: string;
    created_at: string;
  }
  
  interface User {
    id: string;
    name: string;
    online: boolean;
  }
  
  const props = defineProps<{
    messages: Message[];
    currentUser: User;
    selectedUser: User;
  }>();
  
  const emit = defineEmits<{
    (e: 'send-message', message: string, type: 'text' | 'file', file?: File): void;
  }>();
  
  const messagesContainer = ref<HTMLElement | null>(null);
  const newMessage = ref('');
  const selectedFile = ref<File | null>(null);
  
  // Scroll to bottom when new messages arrive
  watch(() => props.messages, () => {
    nextTick(() => {
      scrollToBottom();
    });
  }, { deep: true });
  
  // Format timestamp
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('th-TH', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Scroll to bottom of messages
  const scrollToBottom = () => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  };
  
  // Handle file upload
  const handleFileUpload = (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      selectedFile.value = input.files[0];
      sendMessage();
    }
  };
  
  // Send message
  const sendMessage = async () => {
    if (selectedFile.value) {
      emit('send-message', selectedFile.value.name, 'file', selectedFile.value);
      selectedFile.value = null;
    } else if (newMessage.value.trim()) {
      emit('send-message', newMessage.value, 'text');
      newMessage.value = '';
    }
  };
  
  // Initialize
  onMounted(() => {
    scrollToBottom();
  });
  </script>