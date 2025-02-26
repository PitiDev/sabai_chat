import { ref, watch } from 'vue'

export const useTheme = () => {
  // ตัวแปรเก็บค่าธีมปัจจุบัน
  const isDark = ref(false)
  
  // โหลดค่าธีมตอนเริ่มต้น
  const initTheme = () => {
    // เฉพาะใน client side
    if (process.client) {
      // ตรวจสอบจาก localStorage
      const savedTheme = localStorage.getItem('theme')
      
      if (savedTheme) {
        isDark.value = savedTheme === 'dark'
      } else {
        // ใช้ค่าเริ่มต้นตาม system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        isDark.value = prefersDark
      }
      
      applyTheme()
    }
  }
  
  // เปลี่ยนธีม
  const toggleTheme = () => {
    isDark.value = !isDark.value
    applyTheme()
  }
  
  // นำธีมไปใช้กับ document
  const applyTheme = () => {
    if (process.client) {
      const documentElement = document.documentElement
      
      if (isDark.value) {
        documentElement.classList.add('dark')
        localStorage.setItem('theme', 'dark')
      } else {
        documentElement.classList.remove('dark')
        localStorage.setItem('theme', 'light')
      }
    }
  }
  
  // เริ่มต้นธีม
  initTheme()
  
  // ติดตามการเปลี่ยนแปลง system preference
  if (process.client) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      const newColorScheme = e.matches ? 'dark' : 'light'
      if (localStorage.getItem('theme') === null) {
        isDark.value = e.matches
        applyTheme()
      }
    })
  }
  
  return {
    isDark,
    toggleTheme
  }
}