<template>
  <q-breadcrumbs class="row col-12 q-mb-sm q-gutter-y-md">
    <q-breadcrumbs-el
      v-for="(prop, index) in websiteTreeStore.breadcrumbs"
      :key="index"
      :label="prop.label"
      :icon="prop.icon"
      :to="prop.to"
    />
  </q-breadcrumbs>
</template>

<script setup lang="ts">
import { useWebsiteTreeStore } from 'src/stores/website-tree-store';

const websiteTreeStore = useWebsiteTreeStore();
</script>

<style lang="sass" scoped></style>
