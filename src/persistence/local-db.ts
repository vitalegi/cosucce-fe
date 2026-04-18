import Dexie, { EntityTable, Table } from 'dexie';
import Changelog from 'src/models/changelog';
import BoardEntryDto from 'src/budget/models/board-entry-dto';
import BoardAccountDto from 'src/budget/models/board-account-dto';
import BoardCategoryDto from 'src/budget/models/board-category-dto';
import BoardDto from 'src/budget/models/board-dto';

const localDb = new Dexie('cosucce') as Dexie & {
  changelogs: Table<Changelog, number>;
  boards: EntityTable<BoardDto, 'boardId'>;
  boardEntries: EntityTable<BoardEntryDto, 'entryId'>;
  boardAccounts: EntityTable<BoardAccountDto, 'accountId'>;
  boardCategories: EntityTable<BoardCategoryDto, 'categoryId'>;
};
localDb.version(1).stores({
  changelogs: '++changelogId, entityType, action, entityId, status, creationDate, lastUpdate',
  boards: '&boardId, name, creationDate, lastUpdate',
  boardEntries:
    '&entryId, boardId, accountId, categoryId, description, amount, creationDate, lastUpdate',
  boardAccounts: '&accountId, boardId, label, icon, color, enabled, creationDate, lastUpdate',
  boardCategories:
    '&categoryId, boardId, label, icon, color, type, enabled, creationDate, lastUpdate',
});

export default localDb;
