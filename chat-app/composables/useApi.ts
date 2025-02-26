import type { UseFetchOptions } from 'nuxt/app';

export const useApi = () => {
  const config = useRuntimeConfig();
  const authStore = useAuthStore();

  const fetchOptions: UseFetchOptions<any> = {
    baseURL: config.public.apiBase,
    headers: computed(() => {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      if (authStore.token) {
        headers['Authorization'] = `Bearer ${authStore.token}`;
      }
      return headers;
    }),
    watch: false
  };


  return {
    // Auth
    login: (data: { email: string; password: string }) =>
      useFetch('/auth/login', {
        ...fetchOptions,
        method: 'POST',
        body: data
      }),

    register: (data: { email: string; password: string; name: string }) =>
      useFetch('/auth/register', {
        ...fetchOptions,
        method: 'POST',
        body: data
      }),

    getUserProfile: () =>
      useFetch('/auth/profile', {
        ...fetchOptions,
      }),

    // Users
    getAllUsers: () =>
      useFetch('/users', {
        ...fetchOptions,
      }),

    searchUsers: (query: string) =>
      useFetch('/users/search', {
        ...fetchOptions,
        params: { query },

      }),

    // Messages
    getMessages: (userId: string) =>
      useFetch(`/messages/${userId}`, {
        ...fetchOptions,

      }),

    sendMessage: (data: {
      receiverId: string;
      content: string;
      messageType?: string;
      fileUrl?: string | null;
    }) =>
      useFetch('/messages', {
        ...fetchOptions,
        method: 'POST',
        body: data,

      }),

    // ฝั่ง Frontend
    uploadFile: async (file: File) => {
      try {
        const formData = new FormData();
        formData.append('file', file);

        // ไม่ต้องกำหนด Content-Type เพราะ browser จะกำหนดเองสำหรับ FormData
        const response = await fetch(`${config.public.apiBase}/files/upload`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authStore.token}`
            // ไม่ต้องกำหนด 'Content-Type' เอง
          },
          body: formData
        });

        // ตรวจสอบ content type ของ response
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error(`Expected JSON response but got ${contentType}`);
        }

        if (!response.ok) {
          throw new Error(`Upload failed with status ${response.status}`);
        }

        return await response.json();
      } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
      }
    },
    // useApi.ts
    updateAvatar: (data: { backgroundColor: string; icon?: string }) =>
      useFetch('/users/avatar', {
        ...fetchOptions,
        method: 'PUT',
        body: data
      }),
  };
}
