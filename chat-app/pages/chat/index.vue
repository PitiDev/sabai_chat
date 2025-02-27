<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
    <!-- Header -->
    <nav
      class="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-md sticky top-0 z-10 transition-all duration-300">
      <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div class="flex h-14 sm:h-16 justify-between items-center">
          <div class="flex items-center space-x-2">
            <div class="flex-shrink-0">
              <div
                class="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg">
                <h1 class="text-lg sm:text-xl font-bold">Work Chat</h1>
              </div>
            </div>
          </div>

          <!-- Mobile View Toggle (only visible on mobile) -->


          <div class="flex items-center space-x-2 sm:space-x-4">
            <ThemeToggle />
            <!-- User avatar section -->
            <div class="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center cursor-pointer" :class="currentUser ?
              (getUserAvatarClass(currentUser as User) || 'bg-gradient-to-br from-blue-400 to-indigo-500') :
              'bg-gradient-to-br from-blue-400 to-indigo-500'" @click="openAvatarModal">
              <!-- For cases without an icon or user data -->
              <template v-if="!currentUser || !getUserAvatarIcon(currentUser as User)">
                <span class="text-white font-medium text-xs sm:text-sm">
                  {{ currentUser?.name?.charAt(0).toUpperCase() || "?" }}
                </span>
              </template>
              <!-- For cases with an icon -->
              <template v-else>
                <span class="text-white text-xs sm:text-sm">{{ getUserAvatarIcon(currentUser as User) }}</span>
              </template>
            </div>

            <button @click="logout"
              class="rounded-full bg-white dark:bg-gray-700 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 border border-red-200 dark:border-red-800/30 transition-all duration-200 hover:shadow-md hidden sm:flex">
              <span class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1 sm:h-4 sm:w-4 sm:mr-1.5" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </span>
            </button>

            <!-- Mobile Logout Button (icon only) -->
            <button @click="logout"
              class="rounded-full bg-white dark:bg-gray-700 p-1.5 sm:p-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 border border-red-200 dark:border-red-800/30 transition-all duration-200 hover:shadow-md sm:hidden">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Chat Interface -->
    <div
      class="container mx-auto py-2 px-2 sm:py-4 sm:px-3 md:py-6 md:px-4 flex flex-col md:flex-row gap-2 sm:gap-4 md:gap-6 h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)]">

      <!-- User List - Hidden on mobile when chat is active -->
      <div
        class="w-full md:w-1/3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden flex flex-col transition-all duration-300 border border-gray-100 dark:border-gray-700/50"
        :class="{ 'hidden md:flex': mobileView === 'chat' }">
        <div class="p-3 sm:p-4 border-b dark:border-gray-700/50">
          <div class="relative">
            <input type="text" v-model="searchQuery" placeholder="Search users..."
              class="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-700 dark:text-gray-200 transition-colors duration-200" />
            <svg xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 absolute left-3 top-3 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div class="flex-1 overflow-y-auto">
          <!-- User Contact List Skeleton Loading -->
          <div v-if="loading" class="p-4">
            <!-- List container -->
            <div class="space-y-4">
              <!-- Repeat this contact item skeleton multiple times -->
              <div v-for="n in 5" :key="n"
                class="flex items-center p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                <!-- Avatar skeleton -->
                <div class="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>

                <!-- User info skeleton -->
                <div class="ml-4 flex-1">
                  <!-- Name skeleton -->
                  <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 animate-pulse"></div>
                  <!-- Email or secondary info skeleton -->
                  <div class="h-3 mt-2 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>
                </div>

                <!-- Action button or status indicator skeleton -->
                <div class="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
              </div>
            </div>
          </div>
          <div v-else>
            <!-- User List Items -->
            <div v-for="user in users" :key="user.id" @click="
              selectUser(user);
            mobileView = 'chat';
            " class="p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-all duration-200" :class="{
              'bg-blue-50/80 dark:bg-blue-900/20 border-l-4 border-blue-500 dark:border-blue-400':
                selectedUser?.id === user.id,
            }">
              <div class="flex items-center space-x-3">
                <div class="relative">
                  <!-- User Avatar -->
                  <div class="w-12 h-12 rounded-full flex items-center justify-center shadow-md"
                    :class="getUserAvatarBackground(user)">
                    <span v-if="!getUserAvatarIcon(user)" class="text-white font-medium text-lg">
                      {{ user.name.charAt(0).toUpperCase() }}
                    </span>
                    <span v-else class="text-white text-lg">{{
                      getUserAvatarIcon(user)
                    }}</span>
                  </div>
                  <!-- Online Status -->
                  <div v-if="user.is_online"
                    class="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 shadow-sm">
                  </div>
                </div>
                <div class="flex-1">
                  <h3 class="font-medium text-gray-900 dark:text-white">
                    {{ user.name }}
                  </h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                    <span v-if="user.is_online" class="flex items-center text-green-500 dark:text-green-400">
                      <span class="w-1.5 h-1.5 bg-green-500 dark:bg-green-400 rounded-full mr-1.5"></span>
                      Online
                    </span>
                    <span v-else class="flex items-center">
                      <span class="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full mr-1.5"></span>
                      Offline
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Chat Area - Hidden on mobile when contacts are active -->
      <div
        class="w-full md:w-2/3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg flex flex-col transition-all duration-300 border border-gray-100 dark:border-gray-700/50"
        :class="[
          { 'hidden md:flex': mobileView === 'contacts' },
          { 'fixed inset-0 z-20 rounded-none md:static md:z-auto md:rounded-xl': mobileView === 'chat' && isMobile }
        ]">
        <div v-if="!selectedUser"
          class="flex-1 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 p-6">
          <svg xmlns="http://www.w3.org/2000/svg"
            class="h-16 sm:h-20 w-16 sm:w-20 text-gray-300 dark:text-gray-600 mb-4" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <p class="text-lg font-medium mb-2">Select a user to start chatting</p>
          <p class="text-sm text-center max-w-md">
            Choose a contact from the left panel to start a conversation or continue where
            you left off.
          </p>
        </div>
        <template v-else>
          <!-- Chat Header -->
          <div
            class="p-3 sm:p-3 md:p-4 border-b dark:border-gray-700/50 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-t-xl">
            <div class="flex items-center space-x-3 sm:space-x-3">
              <!-- Back button for mobile view -->
              <button @click="mobileView = 'contacts'"
                class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 md:hidden">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-500 dark:text-gray-400" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <div class="relative">
                <div
                  class="w-11 h-11 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 dark:from-blue-500 dark:to-indigo-600 flex items-center justify-center shadow-md">
                  <span class="text-white font-medium text-base sm:text-base md:text-lg">
                    {{ selectedUser.name.charAt(0).toUpperCase() }}
                  </span>
                </div>
                <div v-if="selectedUser.is_online"
                  class="absolute -bottom-0.5 -right-0.5 w-3 h-3 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 shadow-sm">
                </div>
              </div>
              <div>
                <h3 class="font-medium text-gray-900 dark:text-white text-base sm:text-base md:text-lg">
                  {{ selectedUser.name }}
                </h3>
                <p class="text-xs sm:text-xs md:text-sm text-gray-500 dark:text-gray-400 flex items-center">
                  <span v-if="selectedUser.is_online" class="flex items-center text-green-500 dark:text-green-400">
                    <span
                      class="w-1.5 h-1.5 sm:w-1.5 sm:h-1.5 bg-green-500 dark:bg-green-400 rounded-full mr-1.5 sm:mr-1.5"></span>
                    Online
                  </span>
                  <span v-else class="flex items-center">
                    <span
                      class="w-1.5 h-1.5 sm:w-1.5 sm:h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full mr-1.5 sm:mr-1.5"></span>
                    Offline
                  </span>
                </p>
              </div>

              <div v-if="userIsTyping"
                class="text-xs sm:text-xs text-gray-500 dark:text-gray-400 mb-1 sm:mb-2 flex items-center">
                <div class="flex space-x-1 sm:space-x-1 mr-1.5 sm:mr-2">
                  <div class="w-2 h-2 sm:w-2 sm:h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce"
                    style="animation-delay: 0ms"></div>
                  <div class="w-2 h-2 sm:w-2 sm:h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce"
                    style="animation-delay: 150ms"></div>
                  <div class="w-2 h-2 sm:w-2 sm:h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce"
                    style="animation-delay: 300ms"></div>
                </div>
                <span class="italic">Typing...</span>
              </div>
            </div>
          </div>

          <!-- Messages -->
          <div
            class="flex-1 overflow-y-auto py-2 px-2 sm:py-4 sm:px-3 md:py-6 md:px-4 space-y-2 sm:space-y-3 md:space-y-4 chat-background transition-colors duration-200"
            ref="messageContainer">
            <div v-for="message in messages" :key="message.id" class="flex" :class="[
              message.sender_id === currentUser?.id ? 'justify-end' : 'justify-start',
            ]">
              <div class="max-w-[85%] sm:max-w-[75%] md:max-w-[70%]"
                :class="[message.sender_id === currentUser?.id ? 'order-1' : 'order-2']">
                <div class="rounded-2xl px-3 py-2 sm:px-3 sm:py-2.5 md:px-4 md:py-3 shadow-sm" :class="[
                  message.sender_id === currentUser?.id
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-tr-none'
                    : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-tl-none border border-gray-100 dark:border-gray-600',
                ]">
                  <p v-if="message.message_type === 'text'" class="text-sm sm:text-sm md:text-base"
                    v-html="formatEmojis(message.content)"></p>

                  <div v-else-if="message.message_type === 'image'" class="my-1">
                    <img :src="getImageUrl(message.file_url)" :alt="message.content"
                      class="max-w-full rounded-lg max-h-32 sm:max-h-48 md:max-h-64 cursor-pointer hover:opacity-90 transition-opacity duration-200"
                      @click="
                        message.file_url &&
                        openImagePreview(getImageUrl(message.file_url))
                        " />
                    <p v-if="message.content" class="mt-1 sm:mt-2 text-xs sm:text-xs md:text-sm"
                      v-html="formatEmojis(message.content)"></p>
                  </div>

                  <span class="text-3xs text-xs sm:text-2xs md:text-xs mt-0.5 sm:mt-1 block opacity-75" :class="message.sender_id === currentUser?.id
                    ? 'text-blue-100'
                    : 'text-gray-500 dark:text-gray-400'
                    ">
                    {{ formatTime(message.created_at) }}
                  </span>
                </div>
              </div>
              <div v-if="message.sender_id !== currentUser?.id"
                class="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 rounded-full flex-shrink-0 flex items-center justify-center mr-1 sm:mr-2 self-end order-1"
                :class="getSenderAvatarClass(message.sender_id)">
                <span v-if="!getSenderAvatarIcon(message.sender_id)" class="text-white font-medium text-2xs sm:text-xs">
                  {{ getSenderInitial(message.sender_id) }}
                </span>
                <span v-else class="text-white text-2xs sm:text-xs">{{
                  getSenderAvatarIcon(message.sender_id)
                }}</span>
              </div>
            </div>
          </div>

          <!-- Message Input -->
          <div
            class="p-3 sm:p-4 border-t dark:border-gray-700/50 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-b-xl">
            <form @submit.prevent="sendMessage" class="flex space-x-2">
              <label
                class="inline-flex items-center justify-center aspect-square h-10 w-10 sm:h-11 sm:w-11 md:h-12 md:w-12 bg-gray-50 dark:bg-gray-700 rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer transition-colors duration-200">
                <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="handleFileUpload" />
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 sm:h-6 sm:w-6 md:h-6 md:w-6" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </label>
              <div class="flex-1 relative">
                <input v-model="newMessage" type="text" placeholder="Type your message..."
                  class="w-full pl-3 sm:pl-4 pr-10 sm:pr-12 py-2 sm:py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-700 dark:text-gray-200 transition-colors duration-200 text-sm sm:text-base"
                  @input="handleTyping" />
                <div
                  class="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1 text-gray-400">
                  <button type="button" @click="toggleEmojiPicker"
                    class="p-2 sm:p-2.5 bg-gray-50 dark:bg-gray-700 rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 sm:h-6 sm:w-6" fill="none"
                      viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                </div>
              </div>
              <button type="submit"
                class="rounded-full px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center"
                :disabled="!newMessage.trim() && !selectedFile" :class="{
                  'opacity-50 cursor-not-allowed': !newMessage.trim() && !selectedFile,
                }">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </form>

            <div v-if="selectedFile"
              class="mt-2 p-2 sm:p-3 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-center justify-between transition-colors duration-200 border border-gray-200 dark:border-gray-600">
              <div class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 dark:text-blue-400 mr-2" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span class="text-xs sm:text-sm truncate dark:text-white">{{
                  selectedFile.name
                }}</span>
              </div>
              <button @click="clearSelectedFile"
                class="p-1 sm:p-1.5 bg-red-50 dark:bg-red-900/20 rounded-full text-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </template>
      </div>
    </div>

    <!-- Image Preview Modal -->
    <div v-if="previewImage"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 transition-opacity duration-300">
      <div class="max-w-6xl max-h-screen p-4 relative">
        <img :src="previewImage" class="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl" />
        <button @click="closeImagePreview"
          class="absolute top-4 right-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-2.5 transition-colors duration-200">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Add this before the closing div of your message input section -->
    <div v-if="showEmojiPicker"
      class="absolute bottom-20 left-12 z-10 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-2 w-64">
      <div class="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-2 mb-2">
        <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">Emoji</h3>
        <button @click="toggleEmojiPicker"
          class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Category tabs -->
      <div class="flex border-b border-gray-200 dark:border-gray-700 mb-2">
        <button v-for="(category, index) in ['😀', '🎁', '❤️', '🏠', '🚗']" :key="index" @click="activeCategory = index"
          class="px-2 py-1 text-center text-sm transition-colors duration-150" :class="activeCategory === index
            ? 'border-b-2 border-blue-500 dark:border-blue-400'
            : 'text-gray-500 dark:text-gray-400'
            ">
          {{ category }}
        </button>
      </div>

      <!-- Regular emojis section -->
      <div v-if="activeCategory === 0" class="grid grid-cols-7 gap-2 max-h-60 overflow-y-auto p-1">
        <button v-for="emoji in regularEmojis" :key="emoji" @click="addEmoji(emoji)"
          class="text-xl hover:bg-gray-100 dark:hover:bg-gray-700 p-1 rounded transition-colors duration-150">
          {{ emoji }}
        </button>
      </div>

      <!-- Gift emojis section -->
      <div v-if="activeCategory === 1" class="grid grid-cols-7 gap-2 max-h-60 overflow-y-auto p-1">
        <button v-for="emoji in giftEmojis" :key="emoji" @click="addEmoji(emoji)"
          class="text-xl hover:bg-gray-100 dark:hover:bg-gray-700 p-1 rounded transition-colors duration-150">
          {{ emoji }}
        </button>
      </div>

      <!-- Love emojis section -->
      <div v-if="activeCategory === 2" class="grid grid-cols-7 gap-2 max-h-60 overflow-y-auto p-1">
        <button v-for="emoji in loveEmojis" :key="emoji" @click="addEmoji(emoji)"
          class="text-xl hover:bg-gray-100 dark:hover:bg-gray-700 p-1 rounded transition-colors duration-150">
          {{ emoji }}
        </button>
      </div>

      <!-- Home/objects emojis section -->
      <div v-if="activeCategory === 3" class="grid grid-cols-7 gap-2 max-h-60 overflow-y-auto p-1">
        <button v-for="emoji in objectEmojis" :key="emoji" @click="addEmoji(emoji)"
          class="text-xl hover:bg-gray-100 dark:hover:bg-gray-700 p-1 rounded transition-colors duration-150">
          {{ emoji }}
        </button>
      </div>

      <!-- Travel/places emojis section -->
      <div v-if="activeCategory === 4" class="grid grid-cols-7 gap-2 max-h-60 overflow-y-auto p-1">
        <button v-for="emoji in travelEmojis" :key="emoji" @click="addEmoji(emoji)"
          class="text-xl hover:bg-gray-100 dark:hover:bg-gray-700 p-1 rounded transition-colors duration-150">
          {{ emoji }}
        </button>
      </div>

      <!-- Search box -->
      <div class="pt-2 border-t border-gray-200 dark:border-gray-700 mt-2">
        <input v-model="searchEmoji" type="text" placeholder="Search emoji..."
          class="w-full px-2 py-1 text-sm border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
      </div>
    </div>

    <!-- Avatar Modal -->
    <div v-if="showAvatarModal"
      class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300 p-2 sm:p-4">
      <div
        class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-xs sm:max-w-md md:max-w-2xl overflow-hidden border border-gray-200 dark:border-gray-700 transform transition-all duration-300">
        <div
          class="px-3 py-3 sm:px-6 sm:py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h3 class="text-base sm:text-lg font-medium text-gray-900 dark:text-white">
            Choose Profile Avatar
          </h3>
          <button @click="closeAvatarModal"
            class="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd" />
            </svg>
          </button>
        </div>

        <div class="px-3 py-3 sm:px-6 sm:py-4 overflow-y-auto max-h-[70vh] sm:max-h-[80vh]">
          <div class="mb-3 sm:mb-4">
            <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Background Color
            </h4>
            <div class="flex flex-wrap gap-2">
              <button v-for="color in backgroundColors" :key="color.value" @click="selectBackgroundColor(color.value)"
                class="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 transition-all duration-200" :class="[
                  color.value === selectedBgColor
                    ? 'border-blue-500 scale-110'
                    : 'border-transparent',
                  color.class,
                ]"></button>
            </div>
          </div>

          <div class="mb-3 sm:mb-4">
            <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Icon
            </h4>
            <div class="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2 sm:gap-3">
              <button v-for="(icon, index) in avatarIcons" :key="index" @click="selectIcon(index)"
                class="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border-2 transition-all duration-200"
                :class="[
                  selectedIconIndex === index
                    ? 'border-blue-500 scale-110'
                    : 'border-transparent',
                  selectedBgColor,
                ]">
                <span v-if="!icon" class="text-white font-bold text-lg sm:text-xl">
                  {{ currentUser?.name?.charAt(0).toUpperCase() }}
                </span>
                <span v-else class="text-white text-lg sm:text-xl">{{ icon }}</span>
              </button>
            </div>
          </div>

          <div class="mb-4 sm:mb-6">
            <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Preview
            </h4>
            <div class="flex items-center justify-center">
              <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center shadow-lg"
                :class="selectedBgColor">
                <span v-if="!avatarIcons[selectedIconIndex]" class="text-white font-bold text-2xl sm:text-3xl">
                  {{ currentUser?.name?.charAt(0).toUpperCase() }}
                </span>
                <span v-else class="text-white text-2xl sm:text-3xl">{{ avatarIcons[selectedIconIndex] }}</span>
              </div>
            </div>
          </div>
        </div>

        <div
          class="px-3 py-3 sm:px-6 sm:py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-2 sm:space-x-3">
          <button @click="closeAvatarModal"
            class="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 text-sm sm:text-base">
            Cancel
          </button>
          <button @click="saveAvatar"
            class="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors duration-200 text-sm sm:text-base">
            Save
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
interface User {
  id: string;
  name: string;
  email: string;
  is_online: boolean;
  last_seen?: string;
  avatar_url?: string;
  avatar_data?: string;
}

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  message_type: "text" | "file" | "image";
  file_url?: string;
  created_at: string;
  is_read: boolean;
}

const authStore = useAuthStore();
const api = useApi();
const router = useRouter();

// State
const users = ref<User[]>([]);
const selectedUser = ref<User | null>(null);
const messages = ref<Message[]>([]);
const loading = ref(false);
const searchQuery = ref("");
const newMessage = ref("");
const isLoadingUsers = ref(false);
const isLoadingMessages = ref(false);

const messageContainer = ref<HTMLElement | null>(null);
const socket = useSocket();

const fileInput = ref<HTMLInputElement | null>(null);
const selectedFile = ref<File | null>(null);
const isUploading = ref(false);
const previewImage = ref<string | null>(null);

// ส่วนของ State variable
const showAvatarModal = ref(false);
const selectedBgColor = ref("bg-gradient-to-br from-blue-400 to-indigo-500");
const selectedIconIndex = ref(0);

// Get current user from auth store
const currentUser = computed(() => authStore.user);
// Emoji picker
const showEmojiPicker = ref(false);
const activeCategory = ref(0);
const searchEmoji = ref("");

// Define category-specific emoji lists
const regularEmojis = [
  "😀",
  "😃",
  "😄",
  "😁",
  "😆",
  "😅",
  "😂",
  "🤣",
  "😊",
  "😇",
  "🙂",
  "🙃",
  "😉",
  "😌",
  "😍",
  "🥰",
  "😘",
  "😗",
  "😙",
  "😚",
  "😋",
  "😛",
  "😝",
  "😜",
  "🤪",
  "🤨",
  "🧐",
  "🤓",
  "😎",
  "🥸",
  "🤩",
  "🥳",
  "😏",
  "😒",
  "😞",
  "😔",
  "😟",
  "😕",
  "🙁",
  "☹️",
  "😣",
  "😖",
  "😫",
  "😩",
  "🥺",
  "😢",
  "😭",
  "😤",
  "😠",
  "😡",
];

const giftEmojis = [
  "🎁",
  "🎀",
  "🎊",
  "🎉",
  "🎈",
  "🎂",
  "🧁",
  "🍰",
  "🍬",
  "🍭",
  "🍫",
  "🧸",
  "🪄",
  "💝",
  "💐",
  "🌹",
  "🌷",
  "🎄",
  "🏆",
  "🏅",
  "🥇",
  "👑",
  "💎",
  "💰",
  "💵",
  "🪙",
  "📦",
  "🛍️",
  "🎨",
  "🖼️",
];

const loveEmojis = [
  "❤️",
  "🧡",
  "💛",
  "💚",
  "💙",
  "💜",
  "🖤",
  "🤍",
  "🤎",
  "💔",
  "❤️‍🔥",
  "❤️‍🩹",
  "💘",
  "💝",
  "💖",
  "💗",
  "💓",
  "💞",
  "💕",
  "💌",
  "💟",
  "💑",
  "👩‍❤️‍👩",
  "👨‍❤️‍👨",
  "👩‍❤️‍👨",
  "👩‍❤️‍💋‍👩",
  "👨‍❤️‍💋‍👨",
  "👩‍❤️‍💋‍👨",
  "🏩",
  "😍",
];

const objectEmojis = [
  "🏠",
  "🏡",
  "🏢",
  "🏣",
  "🏤",
  "🏥",
  "🏦",
  "🏨",
  "🏩",
  "🏪",
  "🏫",
  "🏬",
  "🏭",
  "🏯",
  "🏰",
  "💒",
  "🗼",
  "🗽",
  "⛪",
  "🕌",
  "🛒",
  "🛋️",
  "🪑",
  "🚪",
  "🪟",
  "🛏️",
  "🛁",
  "🚿",
  "🪞",
  "🧸",
];

const travelEmojis = [
  "🚗",
  "🚕",
  "🚙",
  "🚌",
  "🚎",
  "🏎️",
  "🚓",
  "🚑",
  "🚒",
  "🚐",
  "🛻",
  "🚚",
  "🚛",
  "🚜",
  "🛵",
  "🏍️",
  "🛺",
  "🚲",
  "🛴",
  "🚂",
  "✈️",
  "🛩️",
  "🚀",
  "🛸",
  "🚁",
  "⛵",
  "🚢",
  "🛳️",
  "🚤",
  "⚓",
];

const messageSound = ref<HTMLAudioElement | null>(null);

// สีพื้นหลังที่สามารถเลือกได้
const backgroundColors = [
  {
    value: "bg-gradient-to-br from-blue-400 to-indigo-500",
    class: "bg-gradient-to-br from-blue-400 to-indigo-500",
  },
  {
    value: "bg-gradient-to-br from-purple-400 to-pink-500",
    class: "bg-gradient-to-br from-purple-400 to-pink-500",
  },
  {
    value: "bg-gradient-to-br from-red-400 to-orange-500",
    class: "bg-gradient-to-br from-red-400 to-orange-500",
  },
  {
    value: "bg-gradient-to-br from-green-400 to-teal-500",
    class: "bg-gradient-to-br from-green-400 to-teal-500",
  },
  {
    value: "bg-gradient-to-br from-yellow-400 to-orange-500",
    class: "bg-gradient-to-br from-yellow-400 to-orange-500",
  },
  {
    value: "bg-gradient-to-br from-pink-400 to-purple-500",
    class: "bg-gradient-to-br from-pink-400 to-purple-500",
  },
  {
    value: "bg-gradient-to-br from-teal-400 to-blue-500",
    class: "bg-gradient-to-br from-teal-400 to-blue-500",
  },
  {
    value: "bg-gradient-to-br from-indigo-400 to-purple-500",
    class: "bg-gradient-to-br from-indigo-400 to-purple-500",
  },
];

// ไอคอนสำหรับอวาตาร์
const avatarIcons = [
  "",
  "👨‍💻",
  "👩‍💻",
  "😀",
  "😃",
  "😄",
  "😁",
  "😆",
  "😅",
  "😂",
  "🤣",
  "😊",
  "😇",
  "🙂",
  "🙃",
  "😉",
  "😌",
  "😍",
  "🥰",
  "😘",
  "😗",
  "😙",
  "😚",
  "😋",
  "😛",
  "😝",
  "😜",
  "🤪",
  "🤨",
  "🧐",
  "🤓",
  "😎",
  "🤩",
  "😏",
  "😒",
  "😞",
  "😔",
  "😟",
  "😕",
  "🙁",
  "☹️",
  "😣",
  "😖",
  "😫",
  "😩",
  "🥺",
  "😢",
  "😭",
  "😤",
  "😠",
  "😡",
  "🤬",
  "🤯",
];

// Add this with other refs near the top of the script
const mobileView = ref<'chat' | 'contacts'>('contacts');
const isMobile = ref(false);

// Load users
const loadUsers = async () => {
  try {
    loading.value = true;
    const { data, error } = await api.getAllUsers();
    if (error.value) throw error.value;

    // ตรวจสอบข้อมูลที่ได้รับ
    console.log("Users data:", data.value);

    // ตรวจสอบรูปแบบ avatar_data
    if (data.value && data.value.length > 0) {
      console.log("First user avatar_data:", data.value[0].avatar_data);
      try {
        if (data.value[0].avatar_data) {
          const parsed = JSON.parse(data.value[0].avatar_data);
          console.log("Parsed avatar_data:", parsed);
        }
      } catch (parseError) {
        console.error("Error parsing avatar_data:", parseError);
      }
    }

    users.value = data.value || [];
  } catch (error) {
    console.error("Error loading users:", error);
  } finally {
    loading.value = false;
  }
};

// Select user and load messages
const selectUser = async (user: User) => {
  if (isLoadingMessages.value) return;

  selectedUser.value = user;
  try {
    isLoadingMessages.value = true;
    const { data, error } = await api.getMessages(user.id);
    if (error.value) throw error.value;

    // เรียงลำดับข้อความตามเวลา (เก่าไปใหม่)
    messages.value = (data.value || []).sort(
      (a: Message, b: Message) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
  } catch (error) {
    console.error("Error loading messages:", error);
  } finally {
    isLoadingMessages.value = false;
  }
};

// Send message
const sendMessage = async () => {
  if ((!newMessage.value.trim() && !selectedFile.value) || !selectedUser.value) return;

  try {
    isUploading.value = true;
    let fileUrl = null;
    let messageType = "text";
    let content = newMessage.value;

    playMessageSound();

    // Upload file if selected
    if (selectedFile.value) {
      const api = useApi();
      const result = await api.uploadFile(selectedFile.value);
      fileUrl = result.fileUrl;
      messageType = "image";

      console.log("Upload result:", result);

      // Use filename if no message content
      if (!content.trim()) {
        content = selectedFile.value.name;
      }
    }
    socket.emit("message:send", {
      receiverId: selectedUser.value.id,
      content,
      messageType,
      fileUrl,
    });

    // ทำการปรับข้อความไปยังตัวเอง (เนื่องจาก WebSocket จะส่งไปยังผู้รับเท่านั้น)
    const tempId = `temp-${Date.now()}`;
    const tempMessage = {
      id: tempId,
      sender_id: currentUser.value?.id,
      receiver_id: selectedUser.value.id,
      content,
      message_type: messageType,
      file_url: fileUrl,
      created_at: new Date().toISOString(),
      is_read: false,
    };

    // เพิ่มข้อความชั่วคราวเพื่อแสดงทันที
    messages.value.push(tempMessage as Message);
    messages.value = [...messages.value].sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );

    // รีเซ็ตฟอร์ม
    newMessage.value = "";
    clearSelectedFile();
  } catch (error) {
    console.error("Error sending message:", error);
  } finally {
    isUploading.value = false;
  }
};

// ตรวจสอบเมื่อมีการพิมพ์
const isTyping = ref(false);
// ตัวแปรใหม่ที่ต้องเพิ่ม
const userIsTyping = ref(false);
let typingTimeout: number | null = null;

// ฟังก์ชันเมื่อมีการพิมพ์
// ฟังก์ชันเมื่อมีการพิมพ์
const handleTyping = () => {
  if (!selectedUser.value || !socket.isConnected.value) return;

  // ส่ง typing event เมื่อเริ่มพิมพ์
  socket.emit("typing", { receiverId: selectedUser.value.id });

  // รีเซ็ตเวลาหลังจากหยุดพิมพ์
  if (typingTimeout) window.clearTimeout(typingTimeout);

  typingTimeout = window.setTimeout(() => {
    if (!selectedUser.value) return;
    socket.emit("typing:stop", { receiverId: selectedUser.value.id });
  }, 3000);
};

// ตรวจจับเมื่อผู้ใช้อื่นกำลังพิมพ์
socket.on("user:typing", (data: { userId: string }) => {
  if (selectedUser.value && data.userId === selectedUser.value.id) {
    isTyping.value = true;

    setTimeout(() => {
      isTyping.value = false;
    }, 3000);
  }
});

// Format time
// Update or add this function
const formatTime = (timestamp: string) => {
  if (!timestamp) return "";

  try {
    // Parse the ISO timestamp
    const date = new Date(timestamp);

    // Check if it's a valid date
    if (isNaN(date.getTime())) return "";

    // Format time in Laos timezone (UTC+7)
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false, // Use 24-hour format for Laos
      timeZone: "Asia/Vientiane", // Vientiane is the capital of Laos
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "";
  }
};

// Logout
const logout = async () => {
  await authStore.logout();
  router.push("/login");
};

// Watch for search query changes
watch(searchQuery, async (newQuery) => {
  if (newQuery.trim()) {
    try {
      loading.value = true;
      const { data, error } = await api.searchUsers(newQuery);
      if (error.value) throw error.value;
      users.value = data.value || [];
    } catch (error) {
      console.error("Error searching users:", error);
    } finally {
      loading.value = false;
    }
  } else {
    loadUsers();
  }
});

// Initialize
onMounted(() => {
  if (authStore.isAuthenticated) {
    loadUsers();
    socket.connect();

    // ลงทะเบียน event handlers
    setupSocketEvents();
    loadUserAvatar();

    // Create audio element
    messageSound.value = new Audio("/sounds/message-sent.mp3"); // Update path to your sound file
    messageSound.value.volume = 0.5; // Set volume (0.0 to 1.0)

    // Preload the sound for faster playback
    messageSound.value.load();

    // Set initial mobile state
    isMobile.value = window.innerWidth < 768;

    // Update on resize
    window.addEventListener('resize', () => {
      isMobile.value = window.innerWidth < 768;
    });
  }
});

const setupSocketEvents = () => {
  // เพิ่มในส่วน onMounted หรือ setupSocketEvents
  socket.on("message:sent", (message) => {
    // แทนที่ข้อความชั่วคราวด้วยข้อความจริง
    const tempIndex = messages.value.findIndex(
      (m) =>
        m.id.toString().startsWith("temp-") &&
        m.sender_id === currentUser.value?.id &&
        m.receiver_id === message.receiver_id
    );

    if (tempIndex !== -1) {
      messages.value[tempIndex] = message;
    }
  });

  // รับข้อความใหม่
  socket.on("message:received", (message: Message) => {
    // รับข้อความใหม่จาก WebSocket
    if (
      selectedUser.value &&
      (message.sender_id === selectedUser.value.id ||
        message.receiver_id === selectedUser.value.id)
    ) {
      // เพิ่มข้อความใหม่และเรียงตามลำดับเวลา
      messages.value.push(message);
      messages.value = [...messages.value].sort(
        (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
    }

    // อัพเดทสถานะออนไลน์
    socket.on("users:online", (onlineUsers: string[]) => {
      // อัพเดทสถานะผู้ใช้ที่ออนไลน์
      users.value = users.value.map((user) => ({
        ...user,
        is_online: onlineUsers.includes(user.id),
      }));
    });
  });

  const interval = setInterval(() => {
    loadUsers();
  }, 50000);

  // เก็บ interval ID เพื่อจะได้ clear เมื่อ unmount
  onUnmounted(() => {
    clearInterval(interval);
    // แจ้งสถานะออฟไลน์เมื่อออกจากหน้า
    socket.updateOnlineStatus(false);
  });

  // เพิ่มการแสดงการเปลี่ยนแปลงสถานะแบบทันที
  socket.on("user:status:change", (data) => {
    const { userId, isOnline } = data;

    // หาผู้ใช้ในรายชื่อและอัพเดทสถานะ
    const userIndex = users.value.findIndex((user) => user.id === userId);
    if (userIndex !== -1) {
      users.value[userIndex].is_online = isOnline;

      // ถ้าเป็นผู้ใช้ที่กำลังคุยด้วย ให้อัพเดทสถานะของ selectedUser ด้วย
      if (selectedUser.value && selectedUser.value.id === userId) {
        selectedUser.value = { ...selectedUser.value, is_online: isOnline };
      }
    }
  });

  // รับ event ผู้ใช้กำลังพิมพ์
  socket.on("user:typing", (data: { userId: string }) => {
    console.log("user typing:", data);
    if (selectedUser.value && data.userId === selectedUser.value.id) {
      userIsTyping.value = true;
    }
  });

  // รับ event ผู้ใช้หยุดพิมพ์
  socket.on("user:typing:stop", (data: { userId: string }) => {
    console.log("user stopped typing:", data);
    if (selectedUser.value && data.userId === selectedUser.value.id) {
      userIsTyping.value = false;
    }
  });
};

const scrollToBottom = () => {
  nextTick(() => {
    if (messageContainer.value) {
      messageContainer.value.scrollTop = messageContainer.value.scrollHeight;
    }
  });
};

// เรียกใช้เมื่อข้อความเปลี่ยน
watch(
  () => messages.value,
  () => {
    scrollToBottom();
  },
  { deep: true }
);

// เรียกใช้เมื่อเลือกผู้ใช้
watch(
  () => selectedUser.value,
  () => {
    scrollToBottom();
  }
);

// ฟังก์ชันจัดการเมื่อเลือกไฟล์
const handleFileUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    const file = input.files[0];

    try {
      // ตรวจสอบว่าเป็นรูปภาพหรือไม่
      if (file.type.startsWith("image/")) {
        // ลดขนาดรูปก่อนอัพโหลด
        selectedFile.value = await resizeImage(file);
      } else {
        selectedFile.value = file;
      }
    } catch (error) {
      console.error("Error resizing image:", error);
      selectedFile.value = file;
    }
  }
};

// ล้างไฟล์ที่เลือก
const clearSelectedFile = () => {
  selectedFile.value = null;
  if (fileInput.value) {
    fileInput.value.value = "";
  }
};

// เปิด preview รูปภาพ
const openImagePreview = (url: string) => {
  previewImage.value = url;
};

// ปิด preview
const closeImagePreview = () => {
  previewImage.value = null;
};

// ฟังก์ชันลดขนาดรูปภาพ
const resizeImage = async (
  file: File,
  maxWidth = 1024,
  maxHeight = 1024,
  quality = 0.8
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        // คำนวณขนาดใหม่
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }

        // สร้าง canvas
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);

        // แปลงเป็น blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Canvas to Blob failed"));
              return;
            }
            // สร้างไฟล์ใหม่
            const resizedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(resizedFile);
          },
          file.type,
          quality
        );
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
};

// ฟังก์ชันแปลง file_url เป็น URL เต็ม
const getImageUrl = (fileUrl: string | undefined | null): string => {
  console.log("fileUrl:", fileUrl);
  if (!fileUrl) return "";

  if (fileUrl.startsWith("/")) {
    return `http://192.168.33.8:8000${fileUrl}`;
  }
  return `http://192.168.33.8:8000/${fileUrl}`;
};

// Toggle emoji picker visibility
const toggleEmojiPicker = () => {
  showEmojiPicker.value = !showEmojiPicker.value;
};

// Add selected emoji to message input
const addEmoji = (emoji: string) => {
  newMessage.value += emoji;
};

// Format message content to render emojis correctly
const formatEmojis = (text: string) => {
  return text || "";
};

// ฟังก์ชันเปิดโมดัลอวาตาร์
const openAvatarModal = () => {
  showAvatarModal.value = true;
};

// ฟังก์ชันปิดโมดัลอวาตาร์
const closeAvatarModal = () => {
  showAvatarModal.value = false;
};

// ฟังก์ชันเลือกสีพื้นหลัง
const selectBackgroundColor = (color: string) => {
  selectedBgColor.value = color;
};

// ฟังก์ชันเลือกไอคอน
const selectIcon = (index: number) => {
  selectedIconIndex.value = index;
};

// ฟังก์ชันบันทึกอวาตาร์
const saveAvatar = async () => {
  try {
    const api = useApi();
    const avatarData = {
      backgroundColor: selectedBgColor.value,
      icon: avatarIcons[selectedIconIndex.value],
    };

    const { data, error } = await api.updateAvatar(avatarData);

    if (error.value) throw error.value;

    // รีโหลดข้อมูลผู้ใช้ทันที
    await authStore.fetchUserProfile();
    await loadUsers();

    // ปิดโมดัล
    closeAvatarModal();

    console.log("Avatar updated successfully:", data.value);
  } catch (error) {
    console.error("Error saving avatar:", error);
    alert("เกิดข้อผิดพลาดในการบันทึกอวาตาร์");
  }
};

// โหลดข้อมูลอวาตาร์เมื่อเริ่มต้น
const loadUserAvatar = () => {
  if (process.client) {
    const savedAvatar = localStorage.getItem("userAvatar");
    if (savedAvatar) {
      try {
        const avatar = JSON.parse(savedAvatar);
        selectedBgColor.value = avatar.backgroundColor;
        const iconIndex = avatarIcons.findIndex((icon) => icon === avatar.icon);
        selectedIconIndex.value = iconIndex >= 0 ? iconIndex : 0;
      } catch (error) {
        console.error("Error parsing saved avatar:", error);
      }
    }
  }
};

// ฟังก์ชันดึงข้อมูลคลาสของอวาตาร์
const getUserAvatarBackground = (user: User) => {
  if (!user) return "bg-gradient-to-br from-blue-400 to-indigo-500";

  // ตรวจสอบว่ามี avatar_data หรือไม่
  if (!user.avatar_data) return "bg-gradient-to-br from-blue-400 to-indigo-500";

  try {
    // พยายามแปลงเป็น JSON object
    let avatarInfo;
    if (typeof user.avatar_data === "string") {
      avatarInfo = JSON.parse(user.avatar_data);
    } else {
      avatarInfo = user.avatar_data;
    }

    // ตรวจสอบว่ามี backgroundColor หรือไม่
    return avatarInfo.backgroundColor || "bg-gradient-to-br from-blue-400 to-indigo-500";
  } catch (error) {
    console.error("Error parsing avatar background:", error, user);
    return "bg-gradient-to-br from-blue-400 to-indigo-500";
  }
};
const getUserAvatarClass = (user: User) => {
  if (!user) return "bg-gradient-to-br from-blue-400 to-indigo-500";

  if (!user.avatar_data) return "bg-gradient-to-br from-blue-400 to-indigo-500";

  try {
    const parsed = JSON.parse(user.avatar_data);
    return parsed.backgroundColor || "bg-gradient-to-br from-blue-400 to-indigo-500";
  } catch (error) {
    console.error("Error handling avatar data:", error);
    return "bg-gradient-to-br from-blue-400 to-indigo-500";
  }
};

const getUserAvatarIcon = (user: User) => {
  if (!user) return "";

  // ตรวจสอบว่ามี avatar_data หรือไม่
  if (!user.avatar_data) return "";

  try {
    // พยายามแปลงเป็น JSON object
    let avatarInfo;
    if (typeof user.avatar_data === "string") {
      avatarInfo = JSON.parse(user.avatar_data);
    } else {
      avatarInfo = user.avatar_data;
    }

    // ตรวจสอบว่ามี icon หรือไม่
    return avatarInfo.icon || "";
  } catch (error) {
    console.error("Error parsing avatar icon:", error, user);
    return "";
  }
};

const getSenderAvatarClass = (senderId: string) => {
  const sender = users.value.find((u) => u.id === senderId);
  if (!sender) return "bg-gradient-to-br from-blue-400 to-indigo-500";
  return getUserAvatarClass(sender);
};

const getSenderAvatarIcon = (senderId: string) => {
  const sender = users.value.find((u) => u.id === senderId);
  if (!sender) return "";
  return getUserAvatarIcon(sender);
};

const getSenderInitial = (senderId: string) => {
  const sender = users.value.find((u) => u.id === senderId);
  return sender ? sender.name.charAt(0).toUpperCase() : "?";
};

// Function to play message sound
const playMessageSound = () => {
  try {
    if (messageSound.value) {
      messageSound.value.currentTime = 0; // Reset sound to beginning
      messageSound.value.play();
    }
  } catch (error) {
    console.error("Error playing sound:", error);
  }
};

// Add this function with other functions
const toggleView = () => {
  mobileView.value = mobileView.value === 'chat' ? 'contacts' : 'chat';
};
</script>
