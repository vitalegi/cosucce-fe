<template>
  <span class="balance-entry-value" :class="amountType">
    <span class="text-weight-medium"> {{ formatAmountIntPart }}</span>
    <span class="decimal-part">,{{ formatAmountDecimalPart }} {{ currency }} </span>
  </span>
</template>

<script setup lang="ts">
import BigDecimalUtil from 'src/utils/numbers/big-decimal-util';
import { SafeBigDecimal } from 'src/utils/numbers/safe-big-decimal';
import { computed } from 'vue';

interface Props {
  amount: SafeBigDecimal;
  currency: string;
}

const props = defineProps<Props>();

const amountType = computed(() =>
  props.amount.compareTo(BigDecimalUtil.ZERO) >= 0 ? 'credit' : 'debit',
);

const formatAmountIntPart = computed((): string => {
  const parts = BigDecimalUtil.format(props.amount);
  return parts.integerPart;
});

const formatAmountDecimalPart = computed((): string => {
  const parts = BigDecimalUtil.format(props.amount);
  return parts.decimalPart;
});
</script>

<style scoped lang="scss">
.decimal-part {
  font-size: smaller;
}
.balance-entry-value.debit {
  color: $debit;
}
.balance-entry-value.credit {
  color: $credit;
}
</style>
