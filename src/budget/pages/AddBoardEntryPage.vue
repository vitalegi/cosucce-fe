<template>
  <q-page class="row items-start justify-evenly q-pa-md">
    <CommonBreadcrumbs />
    <BoardEntryEditor
      :boardId="boardId"
      date=""
      accountId=""
      categoryId=""
      description=""
      amount=""
      @save="save"
    ></BoardEntryEditor>
  </q-page>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import BoardEntryEditor from 'src/budget/components/board-entries/BoardEntryEditor.vue';
import budgetSyncService from 'src/budget/services/budget-sync';
import { useRoute, useRouter } from 'vue-router';
import { toBoardId } from 'src/budget/util/budget-route-params-util';
import routing from 'src/router/routing';
import CommonBreadcrumbs from 'src/commons/components/CommonBreadcrumbs.vue';

const route = useRoute();
const router = useRouter();

void budgetSyncService.synchronize();

async function save(): Promise<void> {
  await routing.budget().viewBoards(router);
}
const boardId = ref<string>(toBoardId(route.params));

watch(
  () => route.params,
  (newParams) => {
    boardId.value = toBoardId(newParams);
  },
);
</script>
