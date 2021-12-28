import { defineStore } from 'pinia';
import supabase from '../includes/supabase';

const useAuthStore = defineStore('auth', {
  state: () => ({
    authModalShow: false,
    user: {},
  }),
  actions: {
    toggleAuthModal() {
      this.authModalShow = !this.authModalShow;
    },
    async authenticate() {
      const user = supabase.auth.user();
      this.user = user;
    },
    async logout() {
      try {
        const { error } = supabase.auth.signOut();

        if (error) {
          throw error;
        }
        this.user = null;
      } catch (error) {
        alert(error.message);
      }
    },
  },
});

export default useAuthStore;
