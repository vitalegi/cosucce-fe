<template>
  <q-page class="row items-start justify-evenly q-pa-md">
    <div class="main-content col-12">
      <CommonBreadcrumbs />
      <div class="text-h2">Rename Board</div>
      <b>TODO</b>
      <q-separator />
      <div class="text-h2">Check sync status</div>
      <b>TODO</b>
      <q-separator />
      <div class="text-h2">Import</div>
      <BoardDataImport :boardId="boardId" />
      <q-separator />
      <div class="text-h2">Export</div>
      <b>TODO</b>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { ref, watch } from 'vue';
import { toBoardId } from 'src/budget/util/budget-route-params-util';
import CommonBreadcrumbs from 'src/commons/components/CommonBreadcrumbs.vue';
import BoardDataImport from 'src/budget/components/admin/BoardDataImport.vue';

const route = useRoute();

const boardId = ref<string>(toBoardId(route.params));

watch(
  () => route.params,
  (newParams) => {
    boardId.value = toBoardId(newParams);
  },
);
</script>
<style scoped lang="scss"></style>
