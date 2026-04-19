import { defineStore, acceptHMRUpdate } from 'pinia';
import BoardEntry from 'src/budget/models/board-entry';
import BoardAccount from 'src/budget/models/board-account';
import BoardCategory from 'src/budget/models/board-category';
import localDb from 'src/persistence/local-db';
import { SafeBigDecimal } from 'src/utils/numbers/safe-big-decimal';
import { liveQuery, Subscription } from 'dexie';
import BigDecimalUtil from 'src/utils/numbers/big-decimal-util';
import { AddBoardEntry } from 'src/persistence/impl/board-entry-persistence-add';
import { UpdateBoardEntry } from 'src/persistence/impl/board-entry-persistence-update';
import { PersistenceManager } from 'src/persistence/persistence-manager';
import { DeleteBoardEntry } from 'src/persistence/impl/board-entry-persistence-delete';
import { AddBoard } from 'src/persistence/impl/board-persistence-add';
import { UpdateBoard } from 'src/persistence/impl/board-persistence-update';
import { DeleteBoard } from 'src/persistence/impl/board-persistence-delete';
import { AddBoardAccount } from 'src/persistence/impl/board-account-persistence-add';
import { UpdateBoardAccount } from 'src/persistence/impl/board-account-persistence-update';
import { DeleteBoardAccount } from 'src/persistence/impl/board-account-persistence-delete';
import { AddBoardCategory } from 'src/persistence/impl/board-category-persistence-add';
import { UpdateBoardCategory } from 'src/persistence/impl/board-category-persistence-update';
import { DeleteBoardCategory } from 'src/persistence/impl/board-category-persistence-delete';

type BoardEntryFilter = {
  categoryId?: string;
};

function boardEntryFilter(entry: BoardEntry, filter: BoardEntryFilter): boolean {
  if (filter.categoryId !== undefined && entry.categoryId !== filter.categoryId) {
    return false;
  }
  return true;
}

export const useBudgetStore = defineStore('budget', {
  state: () => ({
    persistenceManager: new PersistenceManager(),
    entries: [] as BoardEntry[],
    accounts: new Map<string, BoardAccount>(),
    categories: new Map<string, BoardCategory>(),

    currentBoardId: null as string | null,
    subscriptions: [] as Subscription[],
  }),
  getters: {
    categoriesAsList: (state) => Array.from(state.categories.values()),
    accountsAsList: (state) => Array.from(state.accounts.values()),
    findAccountById: (state) => (accountId: string) => state.accounts.get(accountId),
    findCategoryById: (state) => (categoryId: string) => state.categories.get(categoryId),
    filterEntries: (state) => {
      return (filters: BoardEntryFilter): BoardEntry[] =>
        state.entries.filter((e) => boardEntryFilter(e, filters));
    },
    categorySize: (state) => {
      return (categoryId: string): number => {
        return state.entries.filter((e) => e.categoryId === categoryId).length;
      };
    },
    categoryAmount: (state) => {
      return (categoryId: string): SafeBigDecimal => {
        const category = state.categories.get(categoryId);
        let sign: SafeBigDecimal = BigDecimalUtil.PLUS_ONE;
        if (!!category && category.type === 'DEBIT') {
          sign = BigDecimalUtil.MINUS_ONE;
        }
        const amount = BigDecimalUtil.sum(
          state.entries.filter((e) => e.categoryId === categoryId).map((e) => e.amount),
        );
        return amount.multiply(sign);
      };
    },
    amount: (state) => {
      return (boardEntry: BoardEntry): SafeBigDecimal => {
        const category = state.categories.get(boardEntry.categoryId);
        let sign: SafeBigDecimal = BigDecimalUtil.PLUS_ONE;
        if (!!category && category.type === 'DEBIT') {
          sign = BigDecimalUtil.MINUS_ONE;
        }
        return boardEntry.amount.multiply(sign);
      };
    },
  },
  actions: {
    subscribeBoard(boardId: string) {
      if (this.currentBoardId === boardId) {
        return;
      }
      this.unsubscribeBoard();
      this.currentBoardId = boardId;

      this.subscriptions.push(
        liveQuery(() => localDb.boardEntries.where('boardId').equals(boardId).toArray()) //
          .subscribe((elements) => {
            this.entries = elements.map((e) => BoardEntry.fromJson(e));
          }),
      );

      this.subscriptions.push(
        liveQuery(() => localDb.boardAccounts.where('boardId').equals(boardId).toArray()) //
          .subscribe((elements) => {
            this.accounts = new Map(elements.map((e) => [e.accountId, BoardAccount.fromJson(e)]));
          }),
      );

      this.subscriptions.push(
        liveQuery(() => localDb.boardCategories.where('boardId').equals(boardId).toArray()) //
          .subscribe((elements) => {
            this.categories = new Map(
              elements.map((e) => [e.categoryId, BoardCategory.fromJson(e)]),
            );
          }),
      );
    },
    unsubscribeBoard() {
      this.subscriptions.forEach((s) => s.unsubscribe());
      this.subscriptions = [];
      this.currentBoardId = null;
    },

    async addBoard(data: AddBoard): Promise<string> {
      return await this.persistenceManager.add('add', 'board', data);
    },
    async updateBoard(data: UpdateBoard): Promise<string> {
      return await this.persistenceManager.add('update', 'board', data);
    },
    async deleteBoard(data: DeleteBoard): Promise<string> {
      return await this.persistenceManager.add('delete', 'board', data);
    },

    async addBoardEntry(data: AddBoardEntry): Promise<string> {
      return await this.persistenceManager.add('add', 'board-entry', data);
    },
    async updateBoardEntry(data: UpdateBoardEntry): Promise<string> {
      return await this.persistenceManager.add('update', 'board-entry', data);
    },
    async deleteBoardEntry(data: DeleteBoardEntry): Promise<string> {
      return await this.persistenceManager.add('delete', 'board-entry', data);
    },

    async addBoardAccount(data: AddBoardAccount): Promise<string> {
      return await this.persistenceManager.add('add', 'board-account', data);
    },
    async updateBoardAccount(data: UpdateBoardAccount): Promise<string> {
      return await this.persistenceManager.add('update', 'board-account', data);
    },
    async deleteBoardAccount(data: DeleteBoardAccount): Promise<string> {
      return await this.persistenceManager.add('delete', 'board-account', data);
    },

    async addBoardCategory(data: AddBoardCategory): Promise<string> {
      return await this.persistenceManager.add('add', 'board-category', data);
    },
    async updateBoardCategory(data: UpdateBoardCategory): Promise<string> {
      return await this.persistenceManager.add('update', 'board-category', data);
    },
    async deleteBoardCategory(data: DeleteBoardCategory): Promise<string> {
      return await this.persistenceManager.add('delete', 'board-category', data);
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useBudgetStore, import.meta.hot));
}
