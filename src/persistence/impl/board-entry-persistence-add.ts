import BoardEntryDto from 'src/budget/models/board-entry-dto';
import Changelog, { Action, EntityType } from 'src/models/changelog';
import { ChangelogBuilder } from 'src/persistence/changelog-builder';
import EntityLocalPersistence from 'src/persistence/entity-persistence';
import localDb from 'src/persistence/local-db';
import backendService from 'src/services/backend-service';
import UuidUtil from 'src/utils/uuid-util';

export interface AddBoardEntry {
  boardId: string;
  date: string;
  accountId: string;
  categoryId: string;
  description: string;
  amount: string;
}

export class BoardEntryAddPersistence implements EntityLocalPersistence {
  changelogBuilder = new ChangelogBuilder();
  action!: Action;
  entityType!: EntityType;

  async createChangelogEntry(e: AddBoardEntry): Promise<Changelog> {
    const entity = this.toDto(e);
    return this.changelogBuilder.createChangelog({
      action: this.action,
      entityType: this.entityType,
      entity: entity,
      entityId: entity.entryId,
      dependsOn: [e.boardId, e.accountId, e.categoryId],
      oldETag: undefined,
      newETag: UuidUtil.uuid(),
    });
  }

  async executeIdbCollection(changelog: Changelog): Promise<void> {
    const e = changelog.payload as BoardEntryDto;
    await localDb.boardEntries.add(e);
  }
  async executeRemote(changelog: Changelog, allowSSORedirect: boolean): Promise<void> {
    const e = changelog.payload as BoardEntryDto;
    if (changelog.newETag === undefined) {
      throw Error(
        `New ETag of changelog ${changelog.changelogId} is undefined (${changelog.action}, ${changelog.entityType}, ${changelog.entityId})`,
      );
    }
    backendService.boardEntryResource().add({
      boardId: e.boardId,
      entryId: e.entryId,
      date: e.date,
      accountId: e.accountId,
      categoryId: e.categoryId,
      description: e.description,
      amount: e.amount,
      newETag: changelog.newETag,
      allowSSORedirect: allowSSORedirect,
    });
  }

  protected toDto(entity: AddBoardEntry): BoardEntryDto {
    const out = new BoardEntryDto();
    out.entryId = UuidUtil.uuid();
    out.boardId = entity.boardId;
    out.date = entity.date;
    out.accountId = entity.accountId;
    out.categoryId = entity.categoryId;
    out.description = entity.description;
    out.amount = entity.amount;
    out.etag = UuidUtil.uuid();
    out.lastUpdatedBy = 'TODO';
    out.creationDate = new Date().toISOString();
    out.lastUpdate = new Date().toISOString();
    return out;
  }
}
