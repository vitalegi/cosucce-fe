<template>
  <q-item>
    <q-item-section avatar top> </q-item-section>

    <q-item-section top>
      <q-item-label @click="openEditor">
        <span class="text-grey-8">
          <ExpenseValue :amount="amount" currency="" class="expense-value-span" />
          {{ entry.description }}
        </span>
      </q-item-label>
    </q-item-section>

    <q-item-section top side>
      <q-item-label class="q-mt-sm">
        {{ dateLabel }}
      </q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { format } from 'date-fns';
import { useRouter } from 'vue-router';
import ExpenseValue from 'src/budget/components/commons/ExpenseValue.vue';
import BoardEntry from 'src/budget/models/board-entry';
import { useBudgetStore } from 'src/budget/stores/budget-store';
import routing from 'src/router/routing';

interface Props {
  entry: BoardEntry;
}

const dateLabel = computed(() => format(props.entry.date, 'd LLL'));

const props = defineProps<Props>();

const budgetStore = useBudgetStore();
onMounted(() => budgetStore.subscribeBoard(props.entry.boardId));
const router = useRouter();

const amount = computed(() => budgetStore.amount(props.entry));

function openEditor() {
  routing.budget().editBoardEntry(router, props.entry.boardId, props.entry.entryId);
}
</script>

<style scoped lang="scss">
.expense-value-span {
  min-width: 75px;
  display: inline-block;
}
</style>
