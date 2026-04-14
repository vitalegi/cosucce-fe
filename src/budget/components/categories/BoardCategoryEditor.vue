<template>
  <q-form class="col-12 q-gutter-y-md" style="max-width: 600px" greedy @submit="submit()">
    <q-input
      outlined
      v-model="editor.label"
      label="Label"
      :rules="[(v) => v.trim() !== '' || 'La label è obbligatoria']"
    />
    <q-btn-group spread>
      <q-btn
        :color="editor.type === 'DEBIT' ? 'primary' : undefined"
        label="Debit"
        icon="remove"
        @click="editor.type = 'DEBIT'"
      />
      <q-btn
        :color="editor.type === 'CREDIT' ? 'primary' : undefined"
        label="Credit"
        icon="add"
        @click="editor.type = 'CREDIT'"
      />
    </q-btn-group>
    <q-input
      outlined
      v-model="editor.type"
      label="Type"
      :rules="[(v) => v.trim() !== '' || 'La label è obbligatoria']"
    />
    <IconSelector v-model="editor.icon" />
    <q-checkbox outlined v-model="editor.enabled" label="Enabled" />

    <q-btn class="full-width" size="xl" type="submit" color="primary">{{ submitLabel }}</q-btn>
  </q-form>
</template>
<script setup lang="ts">
import { computed, onMounted, onUpdated, ref } from 'vue';
import UuidUtil from 'src/utils/uuid-util';
import { useBudgetStore } from 'src/budget/stores/budget-store';
import IconSelector from 'src/budget/components/commons/IconSelector.vue';
import IconUtil from 'src/budget/util/icon-util';
import { BoardCategoryType } from 'src/budget/models/board-category';

const emit = defineEmits(['save']);

interface Props {
  id?: string;
  boardId: string;
  label: string;
  type: BoardCategoryType;
  icon: string;
  enabled: boolean;
}

const props = withDefaults(defineProps<Props>(), { id: undefined });

const editor = ref<{
  label: string;
  type: BoardCategoryType;
  icon: string;
  enabled: boolean;
}>({
  label: '',
  type: 'DEBIT',
  icon: '',
  enabled: true,
});
const budgetStore = useBudgetStore();

const addMode = computed(() => props.id === undefined);

const submitLabel = computed(() => {
  if (addMode.value) {
    return 'Aggiungi';
  }
  return 'Modifica';
});

async function submit(): Promise<void> {
  if (addMode.value) {
    const id = UuidUtil.uuid();
    await budgetStore.addBoardCategory({
      categoryId: id,
      boardId: props.boardId,
      label: editor.value.label.trim(),
      type: editor.value.type,
      icon: editor.value.icon,
      color: IconUtil.getIcon(editor.value.icon).color,
      enabled: editor.value.enabled,
    });
    emit('save', {
      id: id,
    });
  } else {
    if (props.id === undefined) {
      throw Error('id is undefined, code should be unreachable');
    }
    await budgetStore.updateBoardCategory({
      categoryId: props.id,
      boardId: props.boardId,
      label: editor.value.label.trim(),
      type: editor.value.type,
      icon: editor.value.icon,
      color: IconUtil.getIcon(editor.value.icon).color,
      enabled: editor.value.enabled,
    });
    emit('save', {
      id: props.id,
    });
  }
}

function init() {
  editor.value.label = '';
  editor.value.icon = '';
  editor.value.enabled = true;

  if (props.label) {
    editor.value.label = props.label;
  }
  if (props.icon) {
    editor.value.icon = props.icon;
  }
  if (props.enabled) {
    editor.value.enabled = props.enabled;
  }
}

onMounted(() => init());
onUpdated(() => init());
</script>
