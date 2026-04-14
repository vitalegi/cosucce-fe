<template>
  <q-page class="row items-start justify-evenly q-pa-md">
    <CommonBreadcrumbs />
    <BoardEntriesTable
      :board-id="boardId"
      @add="addBoardEntry"
      @update="updateBoardEntry"
    ></BoardEntriesTable>
  </q-page>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { ref, watch } from 'vue';
import { toBoardId } from 'src/budget/util/budget-route-params-util';
import BoardEntriesTable from 'src/budget/components/board-entries/BoardEntriesTable.vue';
import routing from 'src/router/routing';
import CommonBreadcrumbs from 'src/commons/components/CommonBreadcrumbs.vue';

const route = useRoute();
const router = useRouter();

const boardId = ref<string>(toBoardId(route.params));

function addBoardEntry(): Promise<unknown> {
  return routing.budget().addBoardEntry(router, boardId.value);
}

function updateBoardEntry(entryId: string): Promise<unknown> {
  return routing.budget().editBoardEntry(router, boardId.value, entryId);
}
watch(
  () => route.params,
  (newParams) => {
    boardId.value = toBoardId(newParams);
  },
);
</script>
