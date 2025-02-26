<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-gray-800 dark:to-gray-900 transition-colors duration-300">
    <div class="max-w-md w-full space-y-6 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg backdrop-blur-sm bg-opacity-90 dark:bg-opacity-80">
      <div class="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <!-- Logo or Brand -->
      <div class="text-center">
        <h2 class="mt-4 text-3xl font-extrabold text-gray-900 dark:text-white">ຍິນດີຕ້ອນຮັບ</h2>
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">ເຂົ້າສູ່ລະບົບເພື່ອເຂົ້າເຖິງບັນຊີຂອງທ່ານ</p>
      </div>
      
      <!-- Toggle between Login and Register -->
      <div class="relative flex p-1 space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
        <button 
          @click="isLogin = true" 
          :class="[
            'w-1/2 py-2.5 text-sm font-medium rounded-md transition-all duration-200',
            isLogin 
              ? 'bg-white dark:bg-gray-600 text-indigo-600 dark:text-white shadow-sm' 
              : 'text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white'
          ]"
        >
          ເຂົ້າສູ່ລະບົບ
        </button>
        <button 
          @click="isLogin = false" 
          :class="[
            'w-1/2 py-2.5 text-sm font-medium rounded-md transition-all duration-200',
            !isLogin 
              ? 'bg-white dark:bg-gray-600 text-indigo-600 dark:text-white shadow-sm' 
              : 'text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white'
          ]"
        >
          ລົງທະບຽນ
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="mt-8 space-y-5">
        <div v-if="!isLogin" class="space-y-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            ຊື່
          </label>
          <div class="relative">
            <input 
              v-model="form.name" 
              type="text" 
              required
              class="pl-10 w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent text-gray-900 dark:bg-gray-700 dark:text-white" 
              placeholder="ກະລຸນາໃສ່ຊື່ຂອງທ່ານ"
            />
            <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 dark:text-gray-500">
              <!-- User icon would go here -->
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
              </svg>
            </span>
          </div>
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            ອີເມລ
          </label>
          <div class="relative">
            <input 
              v-model="form.email" 
              type="email" 
              required
              class="pl-10 w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent text-gray-900 dark:bg-gray-700 dark:text-white" 
              placeholder="ອີເມລຂອງທ່ານ"
            />
            <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 dark:text-gray-500">
              <!-- Email icon would go here -->
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </span>
          </div>
        </div>

        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              ລະຫັດຜ່ານ
            </label>
            <a v-if="isLogin" href="#" class="text-xs font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
              ລືມລະຫັດຜ່ານ?
            </a>
          </div>
          <div class="relative">
            <input 
              v-model="form.password" 
              type="password" 
              required
              class="pl-10 w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent text-gray-900 dark:bg-gray-700 dark:text-white" 
              placeholder="ລະຫັດຜ່ານຂອງທ່ານ"
            />
            <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 dark:text-gray-500">
              <!-- Lock icon would go here -->
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
              </svg>
            </span>
          </div>
        </div>

        <!-- Error message -->
        <div v-if="error" class="py-2 px-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
          {{ error }}
        </div>

        <button 
          type="submit"
          class="w-full flex justify-center items-center gap-2 py-2.5 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          :disabled="loading"
        >
          <span v-if="loading" class="flex items-center">
            <!-- Spinner icon would go here -->
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            ກໍາລັງດໍາເນີນການ...
          </span>
          <span v-else>{{ isLogin ? 'ເຂົ້າສູ່ລະບົບ' : 'ລົງທະບຽນ' }}</span>
        </button>
      </form>

      <!-- Social Login (Optional) -->
      <div class="mt-6">
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300 dark:border-gray-600"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
              ຫຼື ເຂົ້າສູ່ລະບົບດ້ວຍ
            </span>
          </div>
        </div>

        <div class="mt-6 grid grid-cols-3 gap-3">
          <button class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600">
            <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fill-rule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clip-rule="evenodd" />
            </svg>
          </button>

          <button class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600">
            <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
            </svg>
          </button>

          <button class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600">
            <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()
const router = useRouter()

const isLogin = ref(true)
const loading = ref(false)
const error = ref('')

const form = reactive({
  name: '',
  email: '',
  password: ''
})

const handleSubmit = async () => {
  try {
    loading.value = true
    error.value = ''

    if (isLogin.value) {
      await authStore.login(form.email, form.password)
    } else {
      await authStore.register(form.email, form.password, form.name)
    }

    // Redirect to chat page after successful login/register
    router.push('/chat')
  } catch (err: any) {
    error.value = err.message || 'ເກີດຂໍ້ຜິດພາດ ກະລຸນາລອງໃໝ່ອີກຄັ້ງ'
  } finally {
    loading.value = false
  }
}

// Redirect if already logged in
onMounted(() => {
  if (authStore.isAuthenticated) {
    router.push('/chat')
  }
})
</script>