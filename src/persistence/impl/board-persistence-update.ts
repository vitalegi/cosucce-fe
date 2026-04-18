import BoardDto from 'src/budget/models/board-dto';
import Changelog, { Action, EntityType } from 'src/models/changelog';
import { ChangelogBuilder } from 'src/persistence/changelog-builder';
import EntityLocalPersistence from 'src/persistence/entity-persistence';
import localDb from 'src/persistence/local-db';
import backendService from 'src/services/backend-service';
import UuidUtil from 'src/utils/uuid-util';

export interface UpdateBoard {
  boardId: string;
  name: string;
}

export class BoardUpdatePersistence implements EntityLocalPersistence {
  changelogBuilder = new ChangelogBuilder();
  action!: Action;
  entityType!: EntityType;

  async createChangelogEntry(e: UpdateBoard): Promise<Changelog> {
    const entity = this.toDto(e);
    const existingBoard = await localDb.boards.get(e.boardId);
    if (existingBoard === undefined) {
      throw Error(`Can't update ${e.boardId}, board not found`);
    }
    entity.creationDate = existingBoard.creationDate;
    entity.lastUpdate = new Date().toISOString();

    return this.changelogBuilder.createChangelog({
      action: this.action,
      entityType: this.entityType,
      entity: entity,
      entityId: entity.boardId,
      oldETag: existingBoard.etag,
      newETag: UuidUtil.uuid(),
    });
  }

  async executeIdbCollection(changelog: Changelog): Promise<void> {
    const e = changelog.payload as BoardDto;
    await localDb.boards.update(e.boardId, e);
  }
  async executeRemote(changelog: Changelog, allowSSORedirect: boolean): Promise<void> {
    const e = changelog.payload as BoardDto;
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
    backendService.boardResource().update({
      boardId: e.boardId,
      name: e.name,
      oldETag: changelog.oldETag,
      newETag: changelog.newETag,
      allowSSORedirect: allowSSORedirect,
    });
  }

  protected toDto(entity: UpdateBoard): BoardDto {
    const out = new BoardDto();
    out.boardId = entity.boardId;
    out.name = entity.name;
    out.creationDate = new Date().toISOString();
    out.lastUpdate = new Date().toISOString();
    out.etag = UuidUtil.uuid();
    return out;
  }
}
