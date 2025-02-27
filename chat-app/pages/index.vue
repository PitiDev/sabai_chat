<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 dark:from-gray-900 dark:to-indigo-900 flex flex-col justify-center items-center p-4 text-gray-900 dark:text-white transition-colors duration-300 relative overflow-hidden">
    <!-- Theme Toggle -->
    <div class="absolute top-4 right-4 z-10">
      <ThemeToggle />
    </div>
    
    <!-- Background Elements -->
    <div class="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
      <div class="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-blue-400/20 dark:bg-blue-500/10 blur-3xl"></div>
      <div class="absolute bottom-1/3 left-1/3 w-80 h-80 rounded-full bg-purple-400/20 dark:bg-purple-500/10 blur-3xl"></div>
      <div class="absolute -top-20 -right-20 w-64 h-64 rounded-full border-4 border-white/10 backdrop-blur-sm"></div>
      <div class="absolute top-40 left-10 w-32 h-32 rounded-full border-4 border-white/10 backdrop-blur-sm"></div>
      <div class="absolute bottom-20 right-10 w-40 h-40 rounded-full border-4 border-white/10 backdrop-blur-sm"></div>
      <div class="absolute -bottom-10 -left-10 w-64 h-64 rounded-full border-4 border-white/10 backdrop-blur-sm"></div>
    </div>
    
    <!-- Hero Section -->
    <div class="max-w-3xl mx-auto text-center relative z-0">
      <!-- Logo/App Name -->
      <div class="mb-6 inline-flex items-center space-x-2">
        <span class="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">ChatApp</span>
      </div>
      
      <!-- Tagline -->
      <p class="text-xl mb-10 text-gray-700 dark:text-gray-300 font-medium">ແພລດຟອມການສື່ສານທີ່ເຊື່ອມຕໍ່ທຸກຄົນເຂົ້າດ້ວຍກັນ</p>
      
      <!-- Features -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-white/20 dark:border-gray-700/30 transform transition-all duration-300 hover:scale-105 hover:shadow-blue-200 dark:hover:shadow-blue-900/20">
          <div class="mb-4 bg-blue-100 dark:bg-blue-900/30 w-16 h-16 mx-auto rounded-xl flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold mb-2">ແຊັດແບບເວລາຈິງ</h3>
          <p class="text-sm text-gray-600 dark:text-gray-300">ສົ່ງແລະຮັບຂໍ້ຄວາມໄດ້ທັນທີ</p>
        </div>
        
        <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-white/20 dark:border-gray-700/30 transform transition-all duration-300 hover:scale-105 hover:shadow-purple-200 dark:hover:shadow-purple-900/20">
          <div class="mb-4 bg-purple-100 dark:bg-purple-900/30 w-16 h-16 mx-auto rounded-xl flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold mb-2">ແຊຣ໌ໄຟລ໌</h3>
          <p class="text-sm text-gray-600 dark:text-gray-300">ແຊຣ໌ໄຟລ໌ແລະເອກະສານໄດ້ຢ່າງງ່າຍດາຍ</p>
        </div>
        
        <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-white/20 dark:border-gray-700/30 transform transition-all duration-300 hover:scale-105 hover:shadow-indigo-200 dark:hover:shadow-indigo-900/20">
          <div class="mb-4 bg-indigo-100 dark:bg-indigo-900/30 w-16 h-16 mx-auto rounded-xl flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold mb-2">ຄວາມປອດໄພສູງ</h3>
          <p class="text-sm text-gray-600 dark:text-gray-300">ປົກປ້ອງຂໍ້ມູນດ້ວຍລະບົບຮັກສາຄວາມປອດໄພ</p>
        </div>
      </div>
      
      <!-- CTA Buttons -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center mb-16">
        <NuxtLink 
          to="/login" 
          class="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-full shadow-lg hover:shadow-blue-500/30 dark:hover:shadow-purple-500/20 transform hover:scale-105 transition duration-300"
        >
          ເຂົ້າສູ່ລະບົບ
        </NuxtLink>
        <!-- <NuxtLink 
          to="/login" 
          class="px-8 py-3 border-2 border-white/70 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transform hover:scale-105 transition duration-300"
        >
          ລົງທະບຽນ
        </NuxtLink> -->
      </div>
      
      <!-- App Preview -->
      <div class="relative mx-auto max-w-lg mb-16">
        <div class="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-30"></div>
        <div class="relative bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div class="h-8 bg-gray-100 dark:bg-gray-700 flex items-center px-4">
            <div class="flex space-x-2">
              <div class="w-2.5 h-2.5 bg-red-500 rounded-full"></div>
              <div class="w-2.5 h-2.5 bg-yellow-500 rounded-full"></div>
              <div class="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
            </div>
          </div>
          <div class="p-4">
            <div class="flex items-start mb-3">
              <div class="bg-gray-100 dark:bg-gray-700 rounded-lg p-2 max-w-xs">
                <p class="text-xs">ສະບາຍດີ! ຍິນດີຕ້ອນຮັບສູ່ ChatApp!</p>
              </div>
            </div>
            <div class="flex items-start justify-end mb-3">
              <div class="bg-blue-100 dark:bg-blue-900/40 rounded-lg p-2 max-w-xs">
                <p class="text-xs">ຂອບໃຈ! ຂ້ອຍດີໃຈທີ່ໄດ້ລອງໃຊ້ແອັບນີ້.</p>
              </div>
            </div>
            <div class="flex items-start mb-3">
              <div class="bg-gray-100 dark:bg-gray-700 rounded-lg p-2 max-w-xs">
                <p class="text-xs">ທ່ານສາມາດແຊຣ໌ໄຟລ໌ແລະສົ່ງຂໍ້ຄວາມໄດ້ຢ່າງງ່າຍດາຍ!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Footer -->
    <div class="mt-auto text-sm text-gray-600 dark:text-gray-400 py-4 px-6 backdrop-blur-sm bg-white/10 dark:bg-gray-900/10 rounded-lg">
      <p>&copy; 2025 ChatApp. ສະຫງວນລິຂະສິດ.</p>
    </div>
  </div>
</template>

<script setup>
// Add any required logic here
</script>