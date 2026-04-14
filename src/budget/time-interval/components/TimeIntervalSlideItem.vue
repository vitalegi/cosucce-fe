<template>
  <q-slide-item @left="previous" @right="next" right-color="grey-2" left-color="grey-2">
    <template v-slot:left v-if="showSlider"> </template>
    <template v-slot:right v-if="showSlider"> </template>

    <q-item>
      <q-item-section class="absolute-center text-subtitle1 text-weight-medium text-primary">
        {{ label }}
      </q-item-section>
    </q-item>
  </q-slide-item>
</template>
<script setup lang="ts">
import { useBudgetTimeIntervalStore } from 'src/budget/time-interval/stores/budget-time-interval-store';
import { computed, onBeforeUnmount } from 'vue';

const budgetTimeIntervalStore = useBudgetTimeIntervalStore();

const label = computed(() => budgetTimeIntervalStore.label);

let timer: NodeJS.Timeout;

const showSlider = computed(() => budgetTimeIntervalStore.interval !== 'all');

function next(details: { reset: () => void }) {
  budgetTimeIntervalStore.next();
  finalize(details.reset);
}

function previous(details: { reset: () => void }) {
  budgetTimeIntervalStore.previous();
  finalize(details.reset);
}

function finalize(reset: () => void) {
  timer = setTimeout(() => {
    reset();
  }, 100);
}

onBeforeUnmount(() => {
  clearTimeout(timer);
});
</script>
