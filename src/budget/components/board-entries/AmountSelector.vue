<template>
  <q-input
    outlined
    v-model="model"
    :step="0.01"
    :label="label"
    type="number"
    hide-bottom-space
    :rules="[
      (val) => (val && val.trim().length !== 0) || 'Campo obbligatorio',
      (val) =>
        new bigDecimal(val.replace(',', '.')).compareTo(new bigDecimal('0')) !== 0 ||
        'Inserire un valore diverso da zero',
    ]"
  />
</template>
<script setup lang="ts">
import bigDecimal from 'js-big-decimal';

const model = defineModel<string>();
interface Props {
  label?: string;
}
withDefaults(defineProps<Props>(), {
  label: 'Importo',
});
</script>
