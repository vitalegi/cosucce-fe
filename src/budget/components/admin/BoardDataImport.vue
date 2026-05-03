<template>
  <div class="q-pa-md">
    <div class="q-gutter-sm">
      <q-radio v-model="format" val="cosucce-legacy" label="Cosucce Legacy" />
      <q-radio v-model="format" val="budget-buddy" label="Budget Buddy" />
    </div>
    <q-input v-model="content" filled type="textarea" @update:model-value="updateData" />
    <q-table title="Entries" :rows="parsedEntries" :columns="entryColumns" row-key="name" />
    <q-table title="Accounts" :rows="parsedAccounts" :columns="accountColumns" row-key="name" dense>
      <template v-slot:body-cell-icon="props">
        <q-td :props="props" :auto-width="true">
          <div>
            <IconDisplay
              :icon="props.row.icon"
              :color="props.row.color"
              :enabled="true"
              size="xs"
            />
          </div>
        </q-td>
      </template>
    </q-table>
    <q-table
      title="Categories"
      :rows="parsedCategories"
      :columns="categoryColumns"
      row-key="name"
      dense
    >
      <template v-slot:body-cell-icon="props">
        <q-td :props="props" :auto-width="true">
          <div>
            <IconDisplay
              :icon="props.row.icon"
              :color="props.row.color"
              :enabled="true"
              size="xs"
            />
          </div>
        </q-td>
      </template>
    </q-table>
    <q-btn @click="load">Load</q-btn>
  </div>
</template>
<script setup lang="ts">
import { formatDate, parse } from 'date-fns';
import { Notify } from 'quasar';
import IconDisplay from 'src/budget/components/commons/IconDisplay.vue';
import BoardAccount from 'src/budget/models/board-account';
import BoardCategory from 'src/budget/models/board-category';
import BoardEntry from 'src/budget/models/board-entry';
import { useBudgetStore } from 'src/budget/stores/budget-store';
import ArrayUtil from 'src/utils/array-util';
import NumberUtil from 'src/utils/numbers/number-util';
import { SafeBigDecimal } from 'src/utils/numbers/safe-big-decimal';
import UuidUtil from 'src/utils/uuid-util';
import { ref } from 'vue';

interface Props {
  boardId: string;
}

const props = withDefaults(defineProps<Props>(), {});

const budgetStore = useBudgetStore();

const format = ref<string>('cosucce-legacy');
const content = ref<string>('');

const entryColumns = [
  {
    name: 'dateValue',
    label: 'Date',
    field: 'dateValue',
    sortable: true,
    format: (v: Date) => formatDate(v, 'dd-MM-yyyy'),
  },
  {
    name: 'description',
    label: 'Description',
    field: 'description',
    sortable: true,
  },
  {
    name: 'amount',
    label: 'Amount',
    field: 'amount',
    sortable: true,
    format: (v: SafeBigDecimal) => NumberUtil.formatBigDecimal(v),
    sort: (a: SafeBigDecimal, b: SafeBigDecimal) => a.compareTo(b),
  },
];

const accountColumns = [
  {
    name: 'label',
    label: 'Label',
    field: 'label',
    sortable: true,
  },
  {
    name: 'icon',
    label: 'Icon',
    field: 'icon',
  },
  {
    name: 'enabled',
    label: 'Enabled',
    field: 'enabled',
    sortable: true,
  },
];
const categoryColumns = [
  {
    name: 'label',
    label: 'Label',
    field: 'label',
    sortable: true,
  },
  {
    name: 'type',
    label: 'Type',
    field: 'type',
    sortable: true,
  },
  {
    name: 'icon',
    label: 'Icon',
    field: 'icon',
  },
  {
    name: 'enabled',
    label: 'Enabled',
    field: 'enabled',
    sortable: true,
  },
];

const parsedEntries = ref<BoardEntry[]>(new Array<BoardEntry>());
const parsedAccounts = ref<BoardAccount[]>(new Array<BoardAccount>());
const parsedCategories = ref<BoardCategory[]>(new Array<BoardCategory>());

async function load() {
  const accountMap = new Map<string, string>();
  for (const e of parsedAccounts.value) {
    const existing = budgetStore.findAccountByLabel(e.label);
    if (existing === undefined) {
      const id = await budgetStore.addBoardAccount({
        boardId: e.boardId,
        color: e.color,
        label: e.label,
        icon: e.icon,
        enabled: e.enabled,
      });
      accountMap.set(e.accountId, id);
    } else {
      accountMap.set(e.accountId, existing.accountId);
    }
  }

  const categoryMap = new Map<string, string>();
  for (const e of parsedCategories.value) {
    const existing = budgetStore.findCategoryByLabel(e.label);
    if (existing === undefined) {
      const id = await budgetStore.addBoardCategory({
        boardId: e.boardId,
        color: e.color,
        label: e.label,
        icon: e.icon,
        enabled: e.enabled,
        type: e.type,
      });
      categoryMap.set(e.categoryId, id);
    } else {
      categoryMap.set(e.categoryId, existing.categoryId);
    }
  }

  for (const e of parsedEntries.value) {
    const accountId = accountMap.get(e.accountId);
    if (accountId === undefined) {
      throw new Error(`Account not found ${e.accountId}`);
    }
    const categoryId = categoryMap.get(e.categoryId);
    if (categoryId === undefined) {
      throw new Error(`Category not found ${e.categoryId}`);
    }
    await budgetStore.addBoardEntry({
      boardId: e.boardId,
      date: e.date,
      accountId: accountId,
      categoryId: categoryId,
      description: e.description,
      amount: NumberUtil.formatBigDecimal(e.amount),
    });
  }
}

function updateData() {
  parsedEntries.value = new Array<BoardEntry>();
  parsedAccounts.value = new Array<BoardAccount>();
  parsedCategories.value = new Array<BoardCategory>();
  if (format.value === 'cosucce-legacy') {
    updateDataCosucceLegacy();
  }
}

interface CosucceLegacyEntry {
  date: Date;
  accountName: string;
  categoryName: string;
  description: string;
  amount: string;
  id: string;
}

function mapCosucceLegacy(line: string): CosucceLegacyEntry {
  const elements = line.split(';');
  if (elements.length !== 6) {
    throw new Error(`Expected 6 elements, got ${elements.length}: ` + line);
  }
  return {
    date: parse(elements[0], 'yyyy/MM/dd', new Date()),
    accountName: elements[1],
    categoryName: elements[2],
    description: elements[3],
    amount: elements[4],
    id: elements[5],
  };
}

function updateDataCosucceLegacy() {
  try {
    const lines = content.value.split('\n');
    const entries = lines
      .filter((line) => line.trim() !== '')
      .map((line) => mapCosucceLegacy(line));

    parsedAccounts.value = ArrayUtil.distinct(entries.map((e) => e.accountName)) //
      .map((name) => {
        const account = new BoardAccount();
        account.accountId = UuidUtil.uuid();
        account.boardId = props.boardId;
        account.label = name;
        account.color = 'grey-5';
        account.icon = 'hourglass_empty';
        account.enabled = true;
        return account;
      });

    parsedCategories.value = ArrayUtil.distinct(entries.map((e) => e.categoryName)) //
      .map((name) => {
        const category = new BoardCategory();
        category.categoryId = UuidUtil.uuid();
        category.boardId = props.boardId;
        category.label = name;
        category.type = 'DEBIT';
        category.color = 'grey-5';
        category.icon = 'hourglass_empty';
        category.enabled = true;
        return category;
      });
    parsedEntries.value = entries.map((e) => {
      const entry = new BoardEntry();
      entry.entryId = UuidUtil.uuid();
      entry.boardId = props.boardId;
      entry.date = formatDate(e.date, 'yyyy-MM-dd');
      entry.dateValue = e.date;
      entry.accountId = parsedAccounts.value.filter((a) => a.label === e.accountName)[0].accountId;

      entry.categoryId = parsedCategories.value.filter(
        (c) => c.label === e.categoryName,
      )[0].categoryId;
      entry.description = e.description;
      entry.amount = NumberUtil.toSafeBigDecimal(e.amount);
      return entry;
    });
  } catch (e) {
    Notify.create('Cosucce Legacy failed parsing: ' + e);
  }
}
</script>
