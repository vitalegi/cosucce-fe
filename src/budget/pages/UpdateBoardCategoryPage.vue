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
import { useRoute, useRouter } from 'vue-router';
import { toCategoryId, toBoardId } from 'src/budget/util/budget-route-params-util';
import routing from 'src/router/routing';
import CommonBreadcrumbs from 'src/commons/components/CommonBreadcrumbs.vue';
import BoardCategoryEditor from 'src/budget/components/categories/BoardCategoryEditor.vue';
import BoardCategory from 'src/budget/models/board-category';
import { useBudgetStore } from 'src/budget/stores/budget-store';

const route = useRoute();
const router = useRouter();

const budgetStore = useBudgetStore();

const boardId = ref<string>(toBoardId(route.params));
const categoryId = ref<string>(toCategoryId(route.params));

async function getElement(categoryId: string): Promise<BoardCategory> {
  const element = budgetStore.findCategoryById(categoryId);
  if (element === undefined) {
    throw Error(`Category ${categoryId} not found`);
  }
  return element;
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
