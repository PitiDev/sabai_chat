<template>
    <div class="fixed top-4 right-4 z-50 space-y-2">
      <TransitionGroup name="notification">
        <div
          v-for="notification in notifications"
          :key="notification.id"
          class="max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto"
          :class="{
            'border-blue-500': notification.type === 'info',
            'border-green-500': notification.type === 'success',
            'border-yellow-500': notification.type === 'warning',
            'border-red-500': notification.type === 'error'
          }"
        >
          <div class="p-4">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <!-- Icons for different notification types -->
                <svg
                  v-if="notification.type === 'info'"
                  class="h-6 w-6 text-blue-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <!-- Add other icons for success, warning, error -->
              </div>
              <div class="ml-3 w-0 flex-1">
                <p class="text-sm font-medium text-gray-900">
                  {{ notification.title }}
                </p>
                <p class="mt-1 text-sm text-gray-500">
                  {{ notification.message }}
                </p>
              </div>
              <div class="ml-4 flex-shrink-0 flex">
                <button
                  @click="removeNotification(notification.id)"
                  class="rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <span class="sr-only">ปิด</span>
                  <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fill-rule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useNotification } from '~/composables/useNotification'
  
  const { notifications, removeNotification } = useNotification()
  </script>
  
  <style scoped>
  .notification-enter-active,
  .notification-leave-active {
    transition: all 0.3s ease;
  }
  
  .notification-enter-from {
    opacity: 0;
    transform: translateX(30px);
  }
  
  .notification-leave-to {
    opacity: 0;
    transform: translateX(30px);
  }
  </style>