<template>
  <q-btn
    outline
    square
    :icon="icon"
    :color="color"
    :disable="!enabled"
    :size="size"
    class="full-width"
  />
</template>
<script setup lang="ts">
interface Props {
  icon: string;
  color: string;
  enabled: boolean;
  size?: string;
}

withDefaults(defineProps<Props>(), {
  size: 'xl',
});
</script>
