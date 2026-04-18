<template>
  <q-page class="row content-start justify-evenly">
    <CommonBreadcrumbs />
    <div class="row col-12 justify-center q-mb-sm">
      <BoardCategoryEditor
        :boardId="boardId"
        label=""
        type="DEBIT"
        :icon="IconUtil.randomIcon().icon"
        :enabled="true"
        @save="save"
      />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { toBoardId } from 'src/budget/util/budget-route-params-util';
import routing from 'src/router/routing';
import IconUtil from 'src/budget/util/icon-util';
import CommonBreadcrumbs from 'src/commons/components/CommonBreadcrumbs.vue';
import BoardCategoryEditor from 'src/budget/components/categories/BoardCategoryEditor.vue';

const route = useRoute();
const router = useRouter();

const boardId = ref<string>(toBoardId(route.params));

async function save(): Promise<void> {
  await routing.budget().settingsViewCategories(router, boardId.value);
}

watch(
  () => route.params,
  (newParams) => {
    boardId.value = toBoardId(newParams);
  },
);
</script>
