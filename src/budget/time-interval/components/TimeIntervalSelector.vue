<template>
  <q-btn
    class="time-interval"
    color="primary"
    :outline="budgetIntervalStore.todayIsInRange"
    label="Today"
    @click="now()"
  />
  <q-btn
    v-for="option in options"
    :key="option.interval"
    class="time-interval"
    color="primary"
    :outline="interval !== option.interval"
    :label="option.label"
    @click="change(option.interval)"
  />
</template>
<script setup lang="ts">
import TimeInterval from 'src/budget/time-interval/models/time-interval';
import { useBudgetTimeIntervalStore } from 'src/budget/time-interval/stores/budget-time-interval-store';
import { computed } from 'vue';

const budgetIntervalStore = useBudgetTimeIntervalStore();

const interval = computed(() => budgetIntervalStore.interval);

const options: { label: string; interval: TimeInterval }[] = [
  { label: 'All', interval: 'all' },
  { label: 'Yearly', interval: 'yearly' },
  { label: 'Monthly', interval: 'monthly' },
  { label: 'Weekly', interval: 'weekly' },
  { label: 'Days', interval: 'rolling-days' },
];

function now(): void {
  budgetIntervalStore.now();
}
function change(newValue: TimeInterval): void {
  budgetIntervalStore.change(newValue);
}
</script>

<style lang="scss" scoped>
.time-interval {
  min-height: 56px;
  width: 100%;
}
</style>
