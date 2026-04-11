import { defineStore, acceptHMRUpdate } from 'pinia';

export const useUserStore = defineStore('userStore', {
  state: () => ({
    oidcIdToken: '',
    oidcAccessToken: '',
  }),
  getters: {
    idToken: (state) => state.oidcIdToken,
    authenticated: (state) => state.oidcIdToken !== '',
  },
  actions: {
    init() {
      this.oidcIdToken = window.localStorage.getItem('oidc_id_token') || '';
      this.oidcAccessToken = window.localStorage.getItem('oidc_access_token') || '';
    },
    updateTokens(oidcIdToken: string, oidcAccessToken: string): void {
      this.oidcIdToken = oidcIdToken;
      this.oidcAccessToken = oidcAccessToken;
      window.localStorage.setItem('oidc_id_token', oidcIdToken);
      window.localStorage.setItem('oidc_access_token', oidcAccessToken);
    },
    removeTokens(): void {
      this.oidcIdToken = '';
      this.oidcAccessToken = '';
      window.localStorage.removeItem('oidc_id_token');
      window.localStorage.removeItem('oidc_access_token');
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot));
}
