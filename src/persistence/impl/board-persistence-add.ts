import BoardDto from 'src/budget/models/board-dto';
import Changelog, { Action, EntityType } from 'src/models/changelog';
import { ChangelogBuilder } from 'src/persistence/changelog-builder';
import EntityLocalPersistence from 'src/persistence/entity-persistence';
import localDb from 'src/persistence/local-db';
import backendService from 'src/services/backend-service';
import UuidUtil from 'src/utils/uuid-util';

export interface AddBoard {
  boardId: string;
  name: string;
}

export class BoardAddPersistence implements EntityLocalPersistence {
  changelogBuilder = new ChangelogBuilder();
  action!: Action;
  entityType!: EntityType;

  async createChangelogEntry(e: AddBoard): Promise<Changelog> {
    const entity = this.toDto(e);
    return this.changelogBuilder.createChangelog({
      action: this.action,
      entityType: this.entityType,
      entity: entity,
      entityId: entity.boardId,
      oldETag: undefined,
      newETag: UuidUtil.uuid(),
    });
  }

  async executeIdbCollection(changelog: Changelog): Promise<void> {
    const e = changelog.payload as BoardDto;
    await localDb.boards.add(e);
  }
  async executeRemote(changelog: Changelog, allowSSORedirect: boolean): Promise<void> {
    const e = changelog.payload as BoardDto;
    if (changelog.newETag === undefined) {
      throw Error(
        `New ETag of changelog ${changelog.changelogId} is undefined (${changelog.action}, ${changelog.entityType}, ${changelog.entityId})`,
      );
    }
    backendService.boardResource().add({
      boardId: e.boardId,
      name: e.name,
      newETag: changelog.newETag,
      allowSSORedirect: allowSSORedirect,
    });
  }

  protected toDto(entity: AddBoard): BoardDto {
    const out = new BoardDto();
    out.boardId = UuidUtil.uuid();
    out.name = entity.name;
    out.etag = UuidUtil.uuid();
    out.creationDate = new Date().toISOString();
    out.lastUpdate = new Date().toISOString();
    return out;
  }
}
