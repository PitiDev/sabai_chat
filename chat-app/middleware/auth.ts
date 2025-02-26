export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore();
  
  // Check if auth is already initialized
  if (!authStore.isAuthenticated) {
    await authStore.checkAuth();
  }

  // If route requires auth and user is not authenticated
  if (to.path !== '/login' && !authStore.isAuthenticated) {
    return navigateTo('/login');
  }

  // If user is authenticated and tries to access login page
  if (to.path === '/login' && authStore.isAuthenticated) {
    return navigateTo('/chat');
  }
});