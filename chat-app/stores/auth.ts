import { defineStore } from 'pinia';

interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  avatar_data?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    currentUser: (state) => state.user
  },

  actions: {
    setToken(token: string) {
      this.token = token;
      // Save token to cookie with longer expiry (7 days)
      const tokenCookie = useCookie('token', {
        maxAge: 60 * 60 * 24 * 7,
        sameSite: 'strict'
      });
      tokenCookie.value = token;
    },

    setUser(user: User) {
      this.user = user;
      // Save both in cookie and localStorage for redundancy
      const userCookie = useCookie('user', {
        maxAge: 60 * 60 * 24 * 7,
        sameSite: 'strict'
      });
      userCookie.value = JSON.stringify(user);

      // Also save in localStorage as backup
      if (process.client) {
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', this.token || '');
      }
    },

    async login(email: string, password: string) {
      const api = useApi();
      const { data, error } = await api.login({ email, password });

      if (error.value) throw error.value;

      if (data.value) {
        this.setToken(data.value.token);
        this.setUser(data.value.user);
      }
    },

    async register(email: string, password: string, name: string) {
      const api = useApi();
      const { data, error } = await api.register({ email, password, name });

      if (error.value) throw error.value;

      if (data.value) {
        this.setToken(data.value.token);
        this.setUser(data.value.user);
      }
    },

    async logout() {
      this.token = null;
      this.user = null;

      // Remove cookies
      const tokenCookie = useCookie('token');
      const userCookie = useCookie('user');
      tokenCookie.value = null;
      userCookie.value = null;

      // Remove localStorage items
      if (process.client) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    },

    async checkAuth() {
      const tokenCookie = useCookie('token');
      const userCookie = useCookie('user');

      let token = tokenCookie.value;
      let userJson = userCookie.value;

      // Try localStorage as fallback
      if (process.client && (!token || !userJson)) {
        token = token || localStorage.getItem('token');
        userJson = userJson || localStorage.getItem('user');
      }

      if (token) {
        this.token = token;

        if (userJson) {
          try {
            this.user = JSON.parse(userJson as string);
          } catch (e) {
            console.error('Failed to parse user data', e);
            this.logout();
          }
        }
      }
    },


    async fetchUserProfile() {
      try {
        // Implementation depends on your API
        const api = useApi();
        const { data, error } = await api.getUserProfile();

        if (error.value) throw error.value;

        if (data.value) {
          this.setUser(data.value);
        }
      } catch (error) {
        console.error('Failed to fetch user profile', error);
        // If fetching profile fails, log out
        this.logout();
      }
    }
  }
});