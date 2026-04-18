import BoardEntryDto from 'src/budget/models/board-entry-dto';
import Changelog, { Action, EntityType } from 'src/models/changelog';
import { ChangelogBuilder } from 'src/persistence/changelog-builder';
import EntityLocalPersistence from 'src/persistence/entity-persistence';
import localDb from 'src/persistence/local-db';
import backendService from 'src/services/backend-service';

export interface DeleteBoardEntry {
  entryId: string;
  boardId: string;
}

export class BoardEntryDeletePersistence implements EntityLocalPersistence {
  changelogBuilder = new ChangelogBuilder();
  action!: Action;
  entityType!: EntityType;

  async createChangelogEntry(e: DeleteBoardEntry): Promise<Changelog> {
    const existingEntry = await localDb.boardEntries.get(e.entryId);
    if (existingEntry === undefined) {
      throw Error(`Can't delete ${e.entryId}, entry not found`);
    }
    return this.changelogBuilder.createChangelog({
      action: this.action,
      entityType: this.entityType,
      entity: existingEntry,
      entityId: e.entryId,
      oldETag: existingEntry.etag,
      newETag: undefined,
    });
  }

  async executeIdbCollection(changelog: Changelog): Promise<void> {
    const e = changelog.payload as BoardEntryDto;
    await localDb.boardEntries.delete(e.entryId);
  }
  async executeRemote(changelog: Changelog, allowSSORedirect: boolean): Promise<void> {
    const e = changelog.payload as BoardEntryDto;
    backendService.boardEntryResource().delete(e.entryId, e.boardId, allowSSORedirect);
  }
}
