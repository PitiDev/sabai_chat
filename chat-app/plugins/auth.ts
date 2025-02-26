export default defineNuxtPlugin(async (nuxtApp) => {
    // Initialize auth store
    const authStore = useAuthStore();
    
    // Check auth on initial load
    await authStore.checkAuth();
  });