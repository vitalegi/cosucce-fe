<template>
  <router-view />
</template>

<script setup lang="ts">
import { useUserStore } from 'src/stores/user-store';

const userStore = useUserStore();
userStore.init();
</script>
