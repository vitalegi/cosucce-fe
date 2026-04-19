import BoardCategoryDto from 'src/budget/models/board-category-dto';
import BoardCategoryType from 'src/budget/models/board-category-type';
import Changelog, { Action, EntityType } from 'src/models/changelog';
import { ChangelogBuilder } from 'src/persistence/changelog-builder';
import EntityLocalPersistence from 'src/persistence/entity-persistence';
import localDb from 'src/persistence/local-db';
import backendService from 'src/services/backend-service';
import UuidUtil from 'src/utils/uuid-util';

export interface UpdateBoardCategory {
  categoryId: string;
  boardId: string;
  label: string;
  icon: string;
  color: string;
  enabled: boolean;
  type: BoardCategoryType;
}

export class BoardCategoryUpdatePersistence implements EntityLocalPersistence {
  changelogBuilder = new ChangelogBuilder();
  action!: Action;
  entityType!: EntityType;

  async createChangelogEntry(e: UpdateBoardCategory): Promise<Changelog> {
    const entity = this.toDto(e);
    const existingCategory = await localDb.boardCategories.get(e.categoryId);
    if (existingCategory === undefined) {
      throw Error(`Can't update ${e.categoryId}, category not found`);
    }
    entity.creationDate = existingCategory.creationDate;
    entity.lastUpdate = new Date().toISOString();

    return this.changelogBuilder.createChangelog({
      action: this.action,
      entityType: this.entityType,
      entity: entity,
      entityId: entity.categoryId,
      dependsOn: [e.categoryId],
      oldETag: existingCategory.etag,
      newETag: UuidUtil.uuid(),
    });
  }

  async executeIdbCollection(changelog: Changelog): Promise<void> {
    const e = changelog.payload as BoardCategoryDto;
    await localDb.boardCategories.update(e.categoryId, e);
  }
  async executeRemote(changelog: Changelog, allowSSORedirect: boolean): Promise<void> {
    const e = changelog.payload as BoardCategoryDto;
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
    backendService.boardCategoryResource().update({
      categoryId: e.categoryId,
      boardId: e.boardId,
      label: e.label,
      icon: e.icon,
      color: e.color,
      type: e.type,
      enabled: e.enabled,
      oldETag: changelog.oldETag,
      newETag: changelog.newETag,
      allowSSORedirect: allowSSORedirect,
    });
  }

  protected toDto(entity: UpdateBoardCategory): BoardCategoryDto {
    const out = new BoardCategoryDto();
    out.categoryId = entity.categoryId;
    out.boardId = entity.boardId;
    out.label = entity.label;
    out.icon = entity.icon;
    out.color = entity.color;
    out.enabled = entity.enabled;
    out.creationDate = new Date().toISOString();
    out.lastUpdate = new Date().toISOString();
    out.etag = UuidUtil.uuid();
    return out;
  }
}
