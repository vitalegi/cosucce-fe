<template>
  <q-btn-group push>
    <q-btn
      v-for="span of spans"
      :key="span"
      :label="shortLabel(span)"
      :color="isSelected(span) ? 'primary' : undefined"
      @click="selectSpan(span)"
    />
  </q-btn-group>
</template>

<script setup lang="ts">
import SpanInterval from 'src/budget/time-interval/models/span-interval';
import { spanService } from 'src/budget/time-interval/services/span-service';
import { useBudgetTimeIntervalStore } from 'src/budget/time-interval/stores/budget-time-interval-store';
import { computed } from 'vue';

const intervalStore = useBudgetTimeIntervalStore();

const spans = computed(() => intervalStore.getAvailableSpans());

function shortLabel(span: SpanInterval): string {
  return spanService.getShortLabel(span);
}

function isSelected(span: SpanInterval): boolean {
  return span === intervalStore.span;
}

function selectSpan(span: SpanInterval): void {
  intervalStore.span = span;
}
</script>

<style scoped lang="scss"></style>
