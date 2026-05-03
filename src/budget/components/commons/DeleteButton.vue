<template>
  <q-btn
    size="20px"
    round
    flat
    color="grey-5"
    icon="delete"
    class="big-button fixed-top-right"
    style="top: 54px; right: 4px"
    @click="submit"
  />
</template>
<script setup lang="ts">
const emit = defineEmits(['delete']);

async function submit(): Promise<void> {
  emit('delete', {});
}
</script>
