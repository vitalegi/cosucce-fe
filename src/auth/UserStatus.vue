<template>
  <div class="text-body1">
    <a v-if="userStore.authenticated" @click="logout()">Esci</a>
    <a v-else @click="login()">Accedi</a>
  </div>
</template>

<script setup lang="ts">
import { authService } from 'src/services/backend-service';
import { useUserStore } from 'src/stores/user-store';

const userStore = useUserStore();

function login() {
  void authService.loginToHomepage();
}

async function logout() {
  await authService.logout();
}
</script>
