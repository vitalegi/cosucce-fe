<template>
  <q-page class="row items-start justify-evenly q-pa-md">
    <CommonBreadcrumbs />
    <BoardCategoriesTable :boardId="boardId" @add="addCategory" />
  </q-page>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { ref, watch } from 'vue';
import { toBoardId } from '../util/budget-route-params-util';
import routing from 'src/router/routing';
import CommonBreadcrumbs from 'src/commons/components/CommonBreadcrumbs.vue';
import BoardCategoriesTable from 'src/budget/components/categories/BoardCategoriesTable.vue';

const route = useRoute();
const router = useRouter();

const boardId = ref<string>(toBoardId(route.params));

function addCategory(): Promise<unknown> {
  return routing.budget().settingsAddCategory(router, boardId.value);
}

watch(
  () => route.params,
  (newParams) => {
    boardId.value = toBoardId(newParams);
  },
);
</script>
