<template>
  <q-page class="row items-start justify-evenly q-pa-md">
    <CommonBreadcrumbs />
    <BoardsTable @add="addBoard" />
  </q-page>
</template>

<script setup lang="ts">
import BoardsTable from 'src/budget/components/boards/BoardsTable.vue';
import CommonBreadcrumbs from 'src/commons/components/CommonBreadcrumbs.vue';
import routing from 'src/router/routing';
import { useRouter } from 'vue-router';

const router = useRouter();

function addBoard(): Promise<unknown> {
  return routing.budget().addBoard(router);
}
</script>
