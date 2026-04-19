<template>
  <q-page class="row items-start justify-evenly q-pa-md">
    <div class="main-content col-12">
      <CommonBreadcrumbs />
      <TimeIntervalSlideItem class="q-mb-sm" />
      <div class="row col-12 justify-center q-mb-sm">
        <q-btn :draggable="false" color="grey-4" outline padding="sm xl">TODO totale </q-btn>
      </div>
      <div class="row col-12 justify-center">
        <div style="max-width: 600px" class="full-width">
          <q-tabs
            v-model="chartTab"
            dense
            class="text-grey"
            active-color="primary"
            indicator-color="primary"
            :align="'center'"
          >
            <q-tab name="balance" icon="account_balance" />
            <q-tab name="entries" icon="format_list_bulleted" />
            <q-tab name="pie" icon="data_usage" />
            <q-tab name="credits" icon="trending_up" />
            <q-tab name="debits" icon="trending_down" />
          </q-tabs>
          <q-tab-panels
            v-model="chartTab"
            animated
            style="background-color: transparent !important"
          >
            <q-tab-panel name="balance" class="row">
              <SpanSelector class="q-mx-auto" />
            </q-tab-panel>
            <q-tab-panel name="entries" class="row">
              <BoardEntriesByCategories :board-id="boardId" />
            </q-tab-panel>
            <q-tab-panel name="pie"> </q-tab-panel>
            <q-tab-panel name="credits" class="row">
              <SpanSelector class="q-mx-auto" />
            </q-tab-panel>
            <q-tab-panel name="debits" class="row">
              <SpanSelector class="q-mx-auto" />
            </q-tab-panel>
          </q-tab-panels>
        </div>
      </div>
    </div>
    <div class="fixed-bottom full-width text-center q-my-sm q-gutter-sm">
      <q-btn size="40px" round outline icon="remove" class="big-button debit" @click="addDebit()" />
      <q-btn size="40px" round outline icon="add" class="big-button credit" @click="addCredit()" />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { ref, watch } from 'vue';
import { toBoardId } from 'src/budget/util/budget-route-params-util';
import routing from 'src/router/routing';
import CommonBreadcrumbs from 'src/commons/components/CommonBreadcrumbs.vue';
import TimeIntervalSlideItem from 'src/budget/time-interval/components/TimeIntervalSlideItem.vue';
import SpanSelector from 'src/budget/components/commons/SpanSelector.vue';
import BoardEntriesByCategories from 'src/budget/components/board-entries/BoardEntriesByCategories.vue';

const route = useRoute();
const router = useRouter();

const boardId = ref<string>(toBoardId(route.params));
const chartTab = ref('balance');

/*
function updateBoardEntry(entryId: string): Promise<unknown> {
  return routing.budget().editBoardEntry(router, boardId.value, entryId);
}
*/

function addCredit(): Promise<unknown> {
  return routing.budget().addBoardEntry(router, boardId.value, 'CREDIT');
}

function addDebit(): Promise<unknown> {
  return routing.budget().addBoardEntry(router, boardId.value, 'DEBIT');
}

watch(
  () => route.params,
  (newParams) => {
    boardId.value = toBoardId(newParams);
  },
);
</script>
<style scoped lang="scss">
.main-content {
  overflow: auto;
}

.q-tab-panels {
  background-color: transparent;
}

.big-button.debit {
  color: $debit;
}
.big-button.credit {
  color: $credit;
}
</style>
