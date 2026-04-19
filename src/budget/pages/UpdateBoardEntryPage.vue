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
      :creationDate="element?.creationDate || new Date()"
      @save="save"
    />
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { toBoardId, toEntryId } from 'src/budget/util/budget-route-params-util';
import routing from 'src/router/routing';
import localDb from 'src/persistence/local-db';
import CommonBreadcrumbs from 'src/commons/components/CommonBreadcrumbs.vue';
import BoardEntryEditor from 'src/budget/components/board-entries/BoardEntryEditor.vue';
import BoardEntry from 'src/budget/models/board-entry';
import bigDecimal from 'js-big-decimal';
import BoardCategoryType from 'src/budget/models/board-category-type';
import { useBudgetStore } from 'src/budget/stores/budget-store';

const route = useRoute();
const router = useRouter();

const boardId = ref<string>(toBoardId(route.params));
const entryId = ref<string>(toEntryId(route.params));

const categoryType = ref<BoardCategoryType>('CREDIT');

const budgetStore = useBudgetStore();
onMounted(() => budgetStore.subscribeBoard(boardId.value));

async function loadData(entryId: string): Promise<void> {
  const elements = await localDb.boardEntries.where('entryId').equals(entryId).toArray();
  console.log('load ', entryId, elements);
  if (elements.length === 0) {
    throw Error(`Entry ${entryId} not found`);
  }
  const entry = BoardEntry.fromJson(elements[0]);
  const category = budgetStore.findCategoryById(entry.categoryId);
  element.value = entry;
  if (category !== undefined) {
    categoryType.value = category.type;
  }
}

const element = ref<BoardEntry>();

void loadData(entryId.value);

async function save(): Promise<void> {
  await routing.budget().viewBoard(router, boardId.value);
}

watch(
  () => route.params,
  (newParams) => {
    boardId.value = toBoardId(newParams);
    entryId.value = toEntryId(newParams);
    void loadData(entryId.value);
  },
);
</script>
