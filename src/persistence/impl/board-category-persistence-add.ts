import BoardCategoryDto from 'src/budget/models/board-category-dto';
import BoardCategoryType from 'src/budget/models/board-category-type';
import Changelog, { Action, EntityType } from 'src/models/changelog';
import { ChangelogBuilder } from 'src/persistence/changelog-builder';
import EntityLocalPersistence from 'src/persistence/entity-persistence';
import localDb from 'src/persistence/local-db';
import backendService from 'src/services/backend-service';
import UuidUtil from 'src/utils/uuid-util';

export interface AddBoardCategory {
  boardId: string;
  label: string;
  icon: string;
  color: string;
  enabled: boolean;
  type: BoardCategoryType;
}

export class BoardCategoryAddPersistence implements EntityLocalPersistence {
  changelogBuilder = new ChangelogBuilder();
  action!: Action;
  entityType!: EntityType;

  async createChangelogEntry(e: AddBoardCategory): Promise<Changelog> {
    const entity = this.toDto(e);
    return this.changelogBuilder.createChangelog({
      action: this.action,
      entityType: this.entityType,
      entity: entity,
      entityId: entity.categoryId,
      dependsOn: [e.boardId],
      oldETag: undefined,
      newETag: UuidUtil.uuid(),
    });
  }

  async executeIdbCollection(changelog: Changelog): Promise<void> {
    const e = changelog.payload as BoardCategoryDto;
    await localDb.boardCategories.add(e);
  }
  async executeRemote(changelog: Changelog, allowSSORedirect: boolean): Promise<void> {
    const e = changelog.payload as BoardCategoryDto;
    if (changelog.newETag === undefined) {
      throw Error(
        `New ETag of changelog ${changelog.changelogId} is undefined (${changelog.action}, ${changelog.entityType}, ${changelog.entityId})`,
      );
    }
    await backendService.boardCategoryResource().add({
      boardId: e.boardId,
      categoryId: e.categoryId,
      label: e.label,
      icon: e.icon,
      color: e.color,
      enabled: e.enabled,
      type: e.type,
      newETag: changelog.newETag,
      allowSSORedirect: allowSSORedirect,
    });
  }

  protected toDto(entity: AddBoardCategory): BoardCategoryDto {
    const out = new BoardCategoryDto();
    out.categoryId = UuidUtil.uuid();
    out.boardId = entity.boardId;
    out.label = entity.label;
    out.icon = entity.icon;
    out.color = entity.color;
    out.enabled = entity.enabled;
    out.type = entity.type;
    out.etag = UuidUtil.uuid();
    out.creationDate = new Date().toISOString();
    out.lastUpdate = new Date().toISOString();
    return out;
  }
}
