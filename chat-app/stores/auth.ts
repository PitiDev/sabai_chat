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

      // Remove localStorage items
      if (process.client) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    },

    async checkAuth() {
      let token = null;
      let userJson = null;

      // Only check localStorage when running in the browser
      if (process.client) {
        token = localStorage.getItem('token');
        userJson = localStorage.getItem('user');
      }

      // Fallback to cookies if still no values
      if (!token || !userJson) {
        const tokenCookie = useCookie('token');
        const userCookie = useCookie('user');
        token = token || tokenCookie.value;
        userJson = userJson || userCookie.value;
      }

      if (token) {
        this.token = token;

        if (userJson) {
          try {
            this.user = JSON.parse(typeof userJson === 'string' ? userJson : '{}');
          } catch (e) {
            console.error('Failed to parse user data', e);
            this.logout();
          }
        }
      } else {
        // No authentication found
        this.token = null;
        this.user = null;
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