<template>
  <q-btn
    outline
    square
    :icon="icon"
    :color="color"
    :disable="!enabled"
    size="xl"
    class="full-width"
  />
</template>
<script setup lang="ts">
interface Props {
  icon: string;
  color: string;
  enabled: boolean;
}

defineProps<Props>();
</script>
