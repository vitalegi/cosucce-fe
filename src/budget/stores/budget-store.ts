import { defineStore, acceptHMRUpdate } from 'pinia';
import persistenceManager from 'src/persistence/persistence-manager';
import BoardEntry from 'src/budget/models/board-entry';
import Board from 'src/budget/models/board';
import PersistenceEngine from 'src/persistence/persistence-engine';
import { Action, EntityType } from 'src/models/changelog';
import BoardAccount from 'src/budget/models/board-account';
import BoardCategory from 'src/budget/models/board-category';
import localDb from 'src/persistence/local-db';

type BoardElement = {
  boardId: string;
  name: string;
};

type BoardAccountElement = {
  accountId: string;
  boardId: string;
  label: string;
  icon: string;
  color: string;
  enabled: boolean;
};

type BoardCategoryElement = {
  categoryId: string;
  boardId: string;
  label: string;
  icon: string;
  color: string;
  enabled: boolean;
};

type BoardEntryElement = {
  entryId: string;
  boardId: string;
  date: string;
  accountId: string;
  categoryId: string;
  description: string;
  amount: string;
};

function makeBoard(data: BoardElement, previousEntry?: Board): Board {
  const e = new Board();
  e.boardId = data.boardId;
  e.name = data.name;
  if (previousEntry) {
    e.creationDate = previousEntry.creationDate;
  } else {
    e.creationDate = new Date();
  }
  e.lastUpdate = new Date();
  return e;
}

function makeBoardAccount(data: BoardAccountElement, previousEntry?: BoardAccount): BoardAccount {
  const e = new BoardAccount();
  e.accountId = data.accountId;
  e.boardId = data.boardId;
  e.label = data.label;
  e.icon = data.icon;
  e.color = data.color;
  e.enabled = data.enabled;
  if (previousEntry) {
    e.creationDate = previousEntry.creationDate;
  } else {
    e.creationDate = new Date();
  }
  e.lastUpdate = new Date();
  return e;
}
function makeBoardCategory(
  data: BoardCategoryElement,
  previousEntry?: BoardCategory,
): BoardCategory {
  const e = new BoardCategory();
  e.categoryId = data.categoryId;
  e.boardId = data.boardId;
  e.label = data.label;
  e.icon = data.icon;
  e.color = data.color;
  e.enabled = data.enabled;
  if (previousEntry) {
    e.creationDate = previousEntry.creationDate;
  } else {
    e.creationDate = new Date();
  }
  e.lastUpdate = new Date();
  return e;
}

function makeBoardEntry(data: BoardEntryElement, previousEntry?: BoardEntry): BoardEntry {
  const e = new BoardEntry();
  e.entryId = data.entryId;
  e.boardId = data.boardId;
  e.date = data.date;
  e.accountId = data.accountId;
  e.categoryId = data.categoryId;
  e.description = data.description;
  e.amount = data.amount;
  if (previousEntry) {
    e.creationDate = previousEntry.creationDate;
  } else {
    e.creationDate = new Date();
  }
  e.lastUpdate = new Date();
  return e;
}

async function execute<E, T>(
  entityType: EntityType,
  action: Action,
  transformer: (e: E) => T,
  engine: PersistenceEngine<T>,
  data: E,
): Promise<void> {
  console.log(`${action} ${entityType} - ${JSON.stringify(data)}`);
  const e = transformer(data);
  const changelogId = await engine.changeLocal(action, e);
  await engine.syncRemote(changelogId, true);
}

export const useBudgetStore = defineStore('budget', {
  state: () => ({}),
  getters: {},
  actions: {
    async addBoard(data: BoardElement): Promise<void> {
      await execute<BoardElement, Board>(
        'board',
        'add',
        (e) => makeBoard(e),
        persistenceManager.addBoard(),
        data,
      );
    },
    async updateBoard(data: BoardElement): Promise<void> {
      const existingEntry = await localDb.boards.where('boardId').equals(data.boardId).first();
      await execute<BoardElement, Board>(
        'board',
        'update',
        (e) => makeBoard(e, existingEntry),
        persistenceManager.updateBoard(),
        data,
      );
    },

    async addBoardEntry(data: BoardEntryElement): Promise<void> {
      await execute<BoardEntryElement, BoardEntry>(
        'board-entry',
        'add',
        (e) => makeBoardEntry(e, undefined),
        persistenceManager.addBoardEntry(),
        data,
      );
    },
    async updateBoardEntry(data: BoardEntryElement): Promise<void> {
      const existingEntry = await localDb.boardEntries
        .where('entryId')
        .equals(data.entryId)
        .first();
      await execute<BoardEntryElement, BoardEntry>(
        'board-entry',
        'update',
        (e) => makeBoardEntry(e, existingEntry),
        persistenceManager.updateBoardEntry(),
        data,
      );
    },

    async addBoardAccount(data: BoardAccountElement): Promise<void> {
      await execute<BoardAccountElement, BoardAccount>(
        'board-account',
        'add',
        (e) => makeBoardAccount(e),
        persistenceManager.addBoardAccount(),
        data,
      );
    },
    async updateBoardAccount(data: BoardAccountElement): Promise<void> {
      const existingEntry = await localDb.boardAccounts
        .where('accountId')
        .equals(data.accountId)
        .first();
      await execute<BoardAccountElement, BoardAccount>(
        'board-account',
        'update',
        (e) => makeBoardAccount(e, existingEntry),
        persistenceManager.updateBoardAccount(),
        data,
      );
    },

    async addBoardCategory(data: BoardCategoryElement): Promise<void> {
      await execute<BoardCategoryElement, BoardCategory>(
        'board-category',
        'add',
        (e) => makeBoardCategory(e),
        persistenceManager.addBoardCategory(),
        data,
      );
    },
    async updateBoardCategory(data: BoardCategoryElement): Promise<void> {
      const existingEntry = await localDb.boardCategories
        .where('categoryId')
        .equals(data.categoryId)
        .first();
      await execute<BoardCategoryElement, BoardCategory>(
        'board-category',
        'update',
        (e) => makeBoardCategory(e, existingEntry),
        persistenceManager.updateBoardCategory(),
        data,
      );
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useBudgetStore, import.meta.hot));
}
