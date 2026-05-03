import BoardDto from 'src/budget/models/board-dto';
import Changelog, { Action, EntityType } from 'src/models/changelog';
import { ChangelogBuilder } from 'src/persistence/changelog-builder';
import EntityLocalPersistence from 'src/persistence/entity-persistence';
import localDb from 'src/persistence/local-db';
import backendService from 'src/services/backend-service';

export interface DeleteBoard {
  boardId: string;
}

export class BoardDeletePersistence implements EntityLocalPersistence {
  changelogBuilder = new ChangelogBuilder();
  action!: Action;
  entityType!: EntityType;

  async createChangelogEntry(e: DeleteBoard): Promise<Changelog> {
    const existingBoard = await localDb.boards.get(e.boardId);
    if (existingBoard === undefined) {
      throw Error(`Can't delete ${e.boardId}, entry not found`);
    }
    return this.changelogBuilder.createChangelog({
      action: this.action,
      entityType: this.entityType,
      entity: existingBoard,
      entityId: e.boardId,
      dependsOn: [],
      oldETag: existingBoard.etag,
      newETag: undefined,
    });
  }

  async executeIdbCollection(changelog: Changelog): Promise<void> {
    const e = changelog.payload as BoardDto;
    await localDb.boards.delete(e.boardId);
  }
  async executeRemote(changelog: Changelog, allowSSORedirect: boolean): Promise<void> {
    const e = changelog.payload as BoardDto;
    await backendService
      .boardResource()
      .delete({ boardId: e.boardId, allowSSORedirect: allowSSORedirect });
  }
}
