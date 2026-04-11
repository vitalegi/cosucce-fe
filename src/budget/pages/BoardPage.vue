<template>
  <q-page class="row items-center justify-evenly">
    <BoardEntriesTable :board-id="boardId" @add="addBoardEntry"></BoardEntriesTable>
  </q-page>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { ref, watch } from 'vue';
import { toBoardId } from 'src/budget/util/budget-route-params-util';
import BoardEntriesTable from 'src/budget/components/board-entries/BoardEntriesTable.vue';
import routing from 'src/router/routing';

const route = useRoute();
const router = useRouter();

const boardId = ref<string>(toBoardId(route.params));

function addBoardEntry(): Promise<unknown> {
  return routing.budget().addBoardEntry(router, boardId.value);
}
watch(
  () => route.params,
  (newParams) => {
    boardId.value = toBoardId(newParams);
  },
);
</script>
