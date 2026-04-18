<template>
  <q-page class="row items-start justify-evenly q-pa-md">
    <CommonBreadcrumbs />
    <BoardAccountEditor
      :boardId="boardId"
      :id="accountId"
      :label="element?.label || ''"
      :icon="element?.icon || ''"
      :enabled="element?.enabled || false"
      @save="save"
    ></BoardAccountEditor>
  </q-page>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { toAccountId, toBoardId } from 'src/budget/util/budget-route-params-util';
import BoardAccountEditor from 'src/budget/components/accounts/BoardAccountEditor.vue';
import routing from 'src/router/routing';
import BoardAccount from '../models/board-account';
import CommonBreadcrumbs from 'src/commons/components/CommonBreadcrumbs.vue';
import { useBudgetStore } from 'src/budget/stores/budget-store';

const route = useRoute();
const router = useRouter();

const budgetStore = useBudgetStore();

const boardId = ref<string>(toBoardId(route.params));
const accountId = ref<string>(toAccountId(route.params));

async function getElement(accountId: string): Promise<BoardAccount> {
  const element = budgetStore.findAccountById(accountId);
  if (element === undefined) {
    throw Error(`Account ${accountId} not found`);
  }
  return element;
}

const element = ref<BoardAccount>();

void getElement(accountId.value).then((e) => (element.value = e));

async function save(): Promise<void> {
  await routing.budget().settingsViewAccounts(router, boardId.value);
}

watch(
  () => route.params,
  (newParams) => {
    boardId.value = toBoardId(newParams);
    accountId.value = toAccountId(newParams);
    void getElement(accountId.value).then((e) => (element.value = e));
  },
);
</script>
