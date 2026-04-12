<template>
  <q-page class="row items-start justify-evenly q-pa-md">
    <CommonBreadcrumbs />
    <BoardEditor name="" @save="save"></BoardEditor>
  </q-page>
</template>

<script setup lang="ts">
import budgetSyncService from 'src/budget/services/budget-sync';
import BoardEditor from 'src/budget/components/boards/BoardEditor.vue';
import routing from 'src/router/routing';
import { useRouter } from 'vue-router';
import CommonBreadcrumbs from 'src/commons/components/CommonBreadcrumbs.vue';
const router = useRouter();
void budgetSyncService.synchronize();

async function save(): Promise<void> {
  await routing.budget().viewBoards(router);
}
</script>
