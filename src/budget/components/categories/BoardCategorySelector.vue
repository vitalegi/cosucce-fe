<template>
  <q-select
    :label="label"
    outlined
    :options="categories"
    v-model="model"
    option-value="categoryId"
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
import { Subscription, liveQuery } from 'dexie';
import { ValidationRule } from 'quasar';
import BoardCategory from 'src/budget/models/board-category';
import IconUtil from 'src/budget/util/icon-util';
import localDb from 'src/persistence/local-db';
import { computed, onMounted, onUnmounted, reactive } from 'vue';

const model = defineModel<string>();

interface Props {
  boardId: string;
  label?: string;
  rules?: ValidationRule[];
}

const props = withDefaults(defineProps<Props>(), {
  label: 'Categoria',
  rules: () => new Array<ValidationRule>(),
});

const validationRules = computed(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mandatoryValue = (val: any) => (val && val.trim().length !== 0) || 'Campo obbligatorio';
  return [mandatoryValue, ...props.rules];
});

const categories = computed((): Array<BoardCategory> => {
  return entries.items
    .filter((a) => a.enabled)
    .sort((a, b) => (a.label.toLowerCase() >= b.label.toLowerCase() ? 1 : -1));
});

const entries = reactive({ items: new Array<BoardCategory>() });
let subscription: Subscription | undefined;

onMounted(() => {
  subscription = liveQuery(() =>
    localDb.boardCategories.where('boardId').equals(props.boardId).toArray(),
  ).subscribe((elements) => (entries.items = elements));
});

onUnmounted(() => {
  subscription?.unsubscribe();
  subscription = undefined;
});
</script>
