<template>
  <q-page class="row items-start justify-evenly q-pa-md">
    <CommonBreadcrumbs />
    <BoardEntryEditor
      :boardId="boardId"
      :id="entryId"
      :date="element?.date || ''"
      :accountId="element?.accountId || ''"
      :categoryId="element?.categoryId || ''"
      :description="element?.description || ''"
      :amount="element?.amount || ''"
      @save="save"
    />
  </q-page>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import budgetSyncService from 'src/budget/services/budget-sync';
import { useRoute, useRouter } from 'vue-router';
import { toBoardId, toEntryId } from 'src/budget/util/budget-route-params-util';
import routing from 'src/router/routing';
import localDb from 'src/persistence/local-db';
import CommonBreadcrumbs from 'src/commons/components/CommonBreadcrumbs.vue';
import BoardEntryEditor from 'src/budget/components/board-entries/BoardEntryEditor.vue';
import BoardEntry from 'src/budget/models/board-entry';

const route = useRoute();
const router = useRouter();
void budgetSyncService.synchronize();

const boardId = ref<string>(toBoardId(route.params));
const entryId = ref<string>(toEntryId(route.params));

async function getElement(entryId: string): Promise<BoardEntry> {
  const elements = await localDb.boardEntries.where('entryId').equals(entryId).toArray();
  console.log('load ', entryId, elements);
  if (elements.length === 0) {
    throw Error(`Entry ${entryId} not found`);
  }
  return elements[0];
}

const element = ref<BoardEntry>();

void getElement(entryId.value).then((e) => (element.value = e));

async function save(): Promise<void> {
  await routing.budget().viewBoard(router, boardId.value);
}

watch(
  () => route.params,
  (newParams) => {
    boardId.value = toBoardId(newParams);
    entryId.value = toEntryId(newParams);
    void getElement(entryId.value).then((e) => (element.value = e));
  },
);
</script>
