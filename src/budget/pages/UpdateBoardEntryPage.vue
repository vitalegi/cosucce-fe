<template>
  <q-page class="row items-start justify-evenly q-pa-md">
    <CommonBreadcrumbs />
    <BoardEntryEditor
      :boardId="boardId"
      :id="entryId"
      :categoryType="categoryType"
      :date="element?.date || ''"
      :accountId="element?.accountId || ''"
      :categoryId="element?.categoryId || ''"
      :description="element?.description || ''"
      :amount="element?.amount || new bigDecimal('0')"
      @save="goToBoard"
      @delete="goToBoard"
    />
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { toBoardId, toEntryId } from 'src/budget/util/budget-route-params-util';
import routing from 'src/router/routing';
import CommonBreadcrumbs from 'src/commons/components/CommonBreadcrumbs.vue';
import BoardEntryEditor from 'src/budget/components/board-entries/BoardEntryEditor.vue';
import bigDecimal from 'js-big-decimal';
import { useBudgetStore } from 'src/budget/stores/budget-store';

const route = useRoute();
const router = useRouter();

const boardId = ref<string>(toBoardId(route.params));
const entryId = ref<string>(toEntryId(route.params));

const budgetStore = useBudgetStore();
onMounted(() => budgetStore.subscribeBoard(boardId.value));

const element = computed(() => budgetStore.findEntryById(entryId.value));

const categoryType = computed(() => {
  if (!element.value) return 'CREDIT';
  const category = budgetStore.findCategoryById(element.value.categoryId);
  return category?.type || 'CREDIT';
});

async function goToBoard(): Promise<void> {
  await routing.budget().viewBoard(router, boardId.value);
}

watch(
  () => route.params,
  (newParams) => {
    boardId.value = toBoardId(newParams);
    entryId.value = toEntryId(newParams);
  },
);
</script>
