<template>
  <q-select
    :label="label"
    outlined
    :options="sortedAccounts"
    v-model="model"
    option-value="accountId"
    option-label="label"
    map-options
    emit-value
    hide-bottom-space
    :rules="validationRules"
  >
    <template v-slot:option="scope">
      <q-item v-bind="scope.itemProps">
        <q-item-section avatar>
          <q-icon :name="scope.opt.icon" :color="IconUtil.getIcon(scope.opt.icon).color" />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ scope.opt.label }}</q-item-label>
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script setup lang="ts">
import { ValidationRule } from 'quasar';
import BoardAccount from 'src/budget/models/board-account';
import { useBudgetStore } from 'src/budget/stores/budget-store';
import IconUtil from 'src/budget/util/icon-util';
import { computed, onMounted } from 'vue';

const model = defineModel<string>();

interface Props {
  boardId: string;
  label?: string;
  rules?: ValidationRule[];
}

const props = withDefaults(defineProps<Props>(), {
  label: 'Account',
  rules: () => new Array<ValidationRule>(),
});

const budgetStore = useBudgetStore();
onMounted(() => budgetStore.subscribeBoard(props.boardId));

const validationRules = computed(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mandatoryValue = (val: any) => (val && val.trim().length !== 0) || 'Campo obbligatorio';
  return [mandatoryValue, ...props.rules];
});

const sortedAccounts = computed(
  (): Array<BoardAccount> =>
    budgetStore.accountsAsList
      .filter((a) => a.enabled)
      .sort((a, b) => (a.label.toLowerCase() >= b.label.toLowerCase() ? 1 : -1)),
);
</script>
