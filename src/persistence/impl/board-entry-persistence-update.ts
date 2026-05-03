import BoardEntryDto from 'src/budget/models/board-entry-dto';
import Changelog, { Action, EntityType } from 'src/models/changelog';
import { ChangelogBuilder } from 'src/persistence/changelog-builder';
import EntityLocalPersistence from 'src/persistence/entity-persistence';
import localDb from 'src/persistence/local-db';
import backendService from 'src/services/backend-service';
import UuidUtil from 'src/utils/uuid-util';

export interface UpdateBoardEntry {
  entryId: string;
  boardId: string;
  date: string;
  accountId: string;
  categoryId: string;
  description: string;
  amount: string;
}

export class BoardEntryUpdatePersistence implements EntityLocalPersistence {
  changelogBuilder = new ChangelogBuilder();
  action!: Action;
  entityType!: EntityType;

  async createChangelogEntry(e: UpdateBoardEntry): Promise<Changelog> {
    const entity = this.toDto(e);
    const existingEntry = await localDb.boardEntries.get(e.entryId);
    if (existingEntry === undefined) {
      throw Error(`Can't update ${e.entryId}, entry not found`);
    }
    entity.lastUpdatedBy = 'TODO';
    entity.creationDate = existingEntry.creationDate;
    entity.lastUpdate = new Date().toISOString();

    return this.changelogBuilder.createChangelog({
      action: this.action,
      entityType: this.entityType,
      entity: entity,
      entityId: entity.entryId,
      dependsOn: [e.entryId, e.accountId, e.categoryId],
      oldETag: existingEntry.etag,
      newETag: UuidUtil.uuid(),
    });
  }

  async executeIdbCollection(changelog: Changelog): Promise<void> {
    const e = changelog.payload as BoardEntryDto;
    await localDb.boardEntries.update(e.entryId, e);
  }
  async executeRemote(changelog: Changelog, allowSSORedirect: boolean): Promise<void> {
    const e = changelog.payload as BoardEntryDto;
    if (changelog.oldETag === undefined) {
      throw Error(
        `Old ETag of changelog ${changelog.changelogId} is undefined (${changelog.action}, ${changelog.entityType}, ${changelog.entityId})`,
      );
    }
    if (changelog.newETag === undefined) {
      throw Error(
        `New ETag of changelog ${changelog.changelogId} is undefined (${changelog.action}, ${changelog.entityType}, ${changelog.entityId})`,
      );
    }
    await backendService.boardEntryResource().update({
      entryId: e.entryId,
      boardId: e.boardId,
      date: e.date,
      accountId: e.accountId,
      categoryId: e.categoryId,
      description: e.description,
      amount: e.amount,
      oldETag: changelog.oldETag,
      newETag: changelog.newETag,
      allowSSORedirect: allowSSORedirect,
    });
  }

  protected toDto(entity: UpdateBoardEntry): BoardEntryDto {
    const out = new BoardEntryDto();
    out.entryId = entity.entryId;
    out.boardId = entity.boardId;
    out.date = entity.date;
    out.accountId = entity.accountId;
    out.categoryId = entity.categoryId;
    out.description = entity.description;
    out.amount = entity.amount;
    out.etag = UuidUtil.uuid();
    return out;
  }
}
