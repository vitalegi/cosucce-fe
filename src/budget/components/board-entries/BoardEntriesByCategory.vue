<template>
  <q-expansion-item dense switch-toggle-side expand-separator>
    <template v-slot:header>
      <q-item-section avatar>
        <q-avatar :icon="category.icon" :color="category.color" text-color="white" />
      </q-item-section>

      <q-item-section>
        {{ category.label }}
      </q-item-section>

      <q-item-section side>
        <q-item-label>
          <ExpenseValue :amount="amount" currency="" />
        </q-item-label>
      </q-item-section>
    </template>
    <BoardEntryExpenseItem v-for="entry in entries" :key="entry.entryId" :entry="entry" />
  </q-expansion-item>
</template>

<script setup lang="ts">
import BoardEntryExpenseItem from 'src/budget/components/board-entries/BoardEntryExpenseItem.vue';
import ExpenseValue from 'src/budget/components/commons/ExpenseValue.vue';
import BoardCategory from 'src/budget/models/board-category';
import { useBudgetStore } from 'src/budget/stores/budget-store';
import { SafeBigDecimal } from 'src/utils/numbers/safe-big-decimal';
import { computed, onMounted } from 'vue';

interface Props {
  boardId: string;
  category: BoardCategory;
  amount: SafeBigDecimal;
}

const props = withDefaults(defineProps<Props>(), {});

const budgetStore = useBudgetStore();
onMounted(() => budgetStore.subscribeBoard(props.boardId));

const entries = computed(() =>
  budgetStore
    .filterEntries({ categoryId: props.category.categoryId })
    .sort((a, b) => -a.amount.compareTo(b.amount)),
);
</script>
