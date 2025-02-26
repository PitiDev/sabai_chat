<template>
  <div class="w-72 bg-white border-r overflow-hidden flex flex-col">
    <!-- Search Box -->
    <div class="p-4 border-b">
      <div class="relative">
        <input v-model="searchQuery" type="text" placeholder="ค้นหาผู้ใช้..."
          class="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          @input="handleSearch" />
        <span class="absolute left-3 top-2.5 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </span>
      </div>
    </div>

    <!-- Users List -->
    <div class="flex-1 overflow-y-auto">
      <div v-if="loading" class="p-4 text-center text-gray-500">
        กำลังโหลด...
      </div>

      <div v-else-if="users.length === 0" class="p-4 text-center text-gray-500">
        ไม่พบผู้ใช้
      </div>

      <div v-else>
        <div v-for="user in users" :key="user.id" @click="$emit('select-user', user.id)"
          class="p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-150"
          :class="{ 'bg-blue-50': selectedUserId === user.id }">
          <div class="flex items-center space-x-3">
            <!-- User Avatar -->
            <div class="relative">
              <div class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center"
                :class="{ 'bg-green-100': user.is_online }">
                <span class="text-gray-600 font-medium" :class="{ 'text-green-700': user.is_online }">
                  {{ user.name.charAt(0).toUpperCase() }}
                </span>
              </div>
              <div v-if="user.is_online"
                class="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white">
              </div>
            </div>

            <!-- User Info -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between">
                <h3 class="text-sm font-medium text-gray-900 truncate">
                  {{ user.name }}
                </h3>
                <span v-if="user.unread_count" class="ml-2 px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full">
                  {{ user.unread_count }}
                </span>
              </div>
              <p class="text-sm text-gray-500">
                {{ user.is_online ? 'ออนไลน์' : formatLastSeen(user.last_seen) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { debounce } from 'lodash';

interface User {
  id: string;
  name: string;
  is_online: boolean;
  last_seen: string;
  unread_count: number;
}

const props = defineProps<{
  users: User[];
  selectedUserId: string | null;
  loading: boolean;
}>();

const emit = defineEmits<{
  (e: 'select-user', userId: string): void;
  (e: 'search', query: string): void;
}>();

const searchQuery = ref('');

// Debounce search to prevent too many API calls
const handleSearch = debounce((event: Event) => {
  emit('search', searchQuery.value);
}, 300);

const formatLastSeen = (timestamp: string) => {
  if (!timestamp) return 'ไม่ระบุ';

  const lastSeen = new Date(timestamp);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - lastSeen.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'เมื่อสักครู่';
  } else if (diffInSeconds < 3600) {
    return `${Math.floor(diffInSeconds / 60)} นาทีที่แล้ว`;
  } else if (diffInSeconds < 86400) {
    return `${Math.floor(diffInSeconds / 3600)} ชั่วโมงที่แล้ว`;
  } else {
    return lastSeen.toLocaleDateString('th-TH');
  }
};

</script>