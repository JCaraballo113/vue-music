import { defineStore } from 'pinia';

const useAuthStore = defineStore('auth', {
  state: () => ({
    authModalShow: false,
  }),
  actions: {
    toggleAuthModal() {
      this.authModalShow = !this.authModalShow;
    },
  },
});

export default useAuthStore;
