<template>
  <q-list bordered class="rounded-borders" v-if="categoriesSortedByAmount.length > 0">
    <BoardEntriesByCategory
      v-for="entry in categoriesSortedByAmount"
      :key="entry.category.categoryId"
      :board-id="boardId"
      :category="entry.category"
      :amount="entry.amount"
    />
  </q-list>
</template>

<script setup lang="ts">
import BoardEntriesByCategory from 'src/budget/components/board-entries/BoardEntriesByCategory.vue';
import BoardCategory from 'src/budget/models/board-category';
import { useBudgetStore } from 'src/budget/stores/budget-store';
import { computed, onMounted } from 'vue';

interface Props {
  boardId: string;
}

const props = withDefaults(defineProps<Props>(), {});

const budgetStore = useBudgetStore();
onMounted(() => budgetStore.subscribeBoard(props.boardId));

function categoryWithAmount(category: BoardCategory) {
  return {
    category: category,
    amount: budgetStore.categoryAmount(category.categoryId),
    size: budgetStore.categorySize(category.categoryId),
  };
}

const categoriesSortedByAmount = computed(() => {
  return budgetStore.categoriesAsList
    .map((c) => categoryWithAmount(c))
    .filter((c) => c.size > 0)
    .sort((a, b) => -a.amount.compareTo(b.amount));
});
</script>
