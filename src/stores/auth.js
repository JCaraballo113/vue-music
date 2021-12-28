import { defineStore } from 'pinia';
import supabase from '../includes/supabase';

const useAuthStore = defineStore('auth', {
  state: () => ({
    authModalShow: false,
    user: null,
  }),
  actions: {
    toggleAuthModal() {
      this.authModalShow = !this.authModalShow;
    },
    async authenticate() {
      const user = supabase.auth.user();
      console.log(user);
      this.user = user;
    },
    async registration({ email, password, ...meta }) {
      try {
        const { user, session, error } = await supabase.auth.signUp(
          { email, password },
          { redirectTo: `${window.location.origin}`, data: meta },
        );

        if (error) {
          throw error;
        }
        supabase.auth.setSession(session.refresh_token);
        this.user = user;
        this.authModalShow = false;
      } catch (e) {
        console.log('Error', e.message);
      }
    },
    async login(email, password) {
      try {
        const { user, session } = await supabase.auth.signIn(
          { email, password },
          { redirectTo: `${window.location.origin}` },
        );
        supabase.auth.setSession(session.refresh_token);
        this.user = user;
        this.authModalShow = false;
      } catch (e) {
        console.log(e.message);
      }
    },
    async logout() {
      try {
        const { error } = await supabase.auth.signOut();

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
