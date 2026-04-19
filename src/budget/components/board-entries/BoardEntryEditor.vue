<template>
  <q-form class="col-12 q-gutter-y-md" style="max-width: 600px" greedy @submit="submit()">
    <DateSelector outlined v-model="editor.date" :mask="DateUtil.Q_DATE_MASK" label="Date" />
    <BoardAccountSelector :board-id="boardId" label="Account" v-model="editor.accountId" />
    <BoardCategorySelector
      :board-id="boardId"
      :category-type="categoryType"
      label="Categoria"
      v-model="editor.categoryId"
    />
    <q-input outlined v-model="editor.description" label="Description" />
    <AmountSelector v-model="editor.amount" label="Importo" />
    <q-btn class="full-width" size="xl" type="submit" color="primary">{{ submitLabel }}</q-btn>
  </q-form>
</template>
<script setup lang="ts">
import { computed, onMounted, onUpdated, ref } from 'vue';
import { useBudgetStore } from 'src/budget/stores/budget-store';
import DateSelector from 'src/budget/components/board-entries/DateSelector.vue';
import DateUtil from 'src/utils/date-util';
import { format } from 'date-fns/format';
import BoardAccountSelector from 'src/budget/components/accounts/BoardAccountSelector.vue';
import BoardCategorySelector from 'src/budget/components/categories/BoardCategorySelector.vue';
import AmountSelector from 'src/budget/components/board-entries/AmountSelector.vue';
import { SafeBigDecimal } from 'src/utils/numbers/safe-big-decimal';
import NumberUtil from 'src/utils/numbers/number-util';
import BoardCategoryType from 'src/budget/models/board-category-type';

const emit = defineEmits(['save']);

interface Props {
  id?: string;
  categoryType: BoardCategoryType;
  boardId: string;
  date: string;
  accountId: string;
  categoryId: string;
  description: string;
  amount: SafeBigDecimal;
}

const props = withDefaults(defineProps<Props>(), { id: undefined });

const editor = ref<{
  date: string;
  accountId: string;
  categoryId: string;
  description: string;
  amount: string;
}>({
  date: '',
  accountId: '',
  categoryId: '',
  description: '',
  amount: '0',
});
const budgetStore = useBudgetStore();

const addMode = computed(() => props.id === undefined);

const submitLabel = computed(() => {
  if (addMode.value) {
    return 'Add';
  }
  return 'Update';
});

async function submit(): Promise<void> {
  const date = DateUtil.convertDate(
    editor.value.date,
    DateUtil.Q_DATE_MASK_FORMAT,
    DateUtil.LOCAL_DATE_FORMAT,
  );
  if (addMode.value) {
    const entryId = await budgetStore.addBoardEntry({
      boardId: props.boardId,
      date: date,
      accountId: editor.value.accountId,
      categoryId: editor.value.categoryId,
      description: editor.value.description,
      amount: NumberUtil.formatBigDecimal(editor.value.amount),
    });
    emit('save', {
      id: entryId,
    });
  } else {
    if (props.id === undefined) {
      throw Error('id is undefined, code should be unreachable');
    }
    await budgetStore.updateBoardEntry({
      entryId: props.id,
      boardId: props.boardId,
      date: date,
      accountId: editor.value.accountId,
      categoryId: editor.value.categoryId,
      description: editor.value.description,
      amount: NumberUtil.formatBigDecimal(editor.value.amount),
    });
    emit('save', {
      id: props.id,
    });
  }
}

function refreshData() {
  editor.value.date = format(new Date(), DateUtil.Q_DATE_MASK_FORMAT);
  editor.value.accountId = '';
  editor.value.categoryId = '';
  editor.value.description = '';
  editor.value.amount = '0';

  if (props.accountId) {
    editor.value.accountId = props.accountId;
  }
  if (props.date) {
    editor.value.date = DateUtil.convertDate(
      props.date,
      DateUtil.LOCAL_DATE_FORMAT,
      DateUtil.Q_DATE_MASK_FORMAT,
    );
  }
  if (props.categoryId) {
    editor.value.categoryId = props.categoryId;
  }
  if (props.accountId) {
    editor.value.description = props.description;
  }
  if (props.accountId) {
    editor.value.amount = NumberUtil.formatBigDecimal(props.amount);
  }
}

onMounted(() => refreshData());
onUpdated(() => refreshData());
</script>
