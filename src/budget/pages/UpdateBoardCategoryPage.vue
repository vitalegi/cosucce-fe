<template>
  <q-page class="row items-start justify-evenly q-pa-md">
    <CommonBreadcrumbs />
    <BoardCategoryEditor
      :boardId="boardId"
      :id="categoryId"
      :label="element?.label || ''"
      :type="element?.type || 'DEBIT'"
      :icon="element?.icon || ''"
      :enabled="element?.enabled || false"
      @save="save"
    />
  </q-page>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import budgetSyncService from 'src/budget/services/budget-sync';
import { useRoute, useRouter } from 'vue-router';
import { toCategoryId, toBoardId } from 'src/budget/util/budget-route-params-util';
import routing from 'src/router/routing';
import localDb from 'src/persistence/local-db';
import CommonBreadcrumbs from 'src/commons/components/CommonBreadcrumbs.vue';
import BoardCategoryEditor from 'src/budget/components/categories/BoardCategoryEditor.vue';
import BoardCategory from 'src/budget/models/board-category';

const route = useRoute();
const router = useRouter();
void budgetSyncService.synchronize();

const boardId = ref<string>(toBoardId(route.params));
const categoryId = ref<string>(toCategoryId(route.params));

async function getElement(categoryId: string): Promise<BoardCategory> {
  const elements = await localDb.boardCategories.where('categoryId').equals(categoryId).toArray();
  console.log('load ', categoryId, elements);
  if (elements.length === 0) {
    throw Error(`Category ${categoryId} not found`);
  }
  return elements[0];
}

const element = ref<BoardCategory>();

void getElement(categoryId.value).then((e) => (element.value = e));

async function save(): Promise<void> {
  await routing.budget().settingsViewCategories(router, boardId.value);
}

watch(
  () => route.params,
  (newParams) => {
    boardId.value = toBoardId(newParams);
    categoryId.value = toCategoryId(newParams);
    void getElement(categoryId.value).then((e) => (element.value = e));
  },
);
</script>
