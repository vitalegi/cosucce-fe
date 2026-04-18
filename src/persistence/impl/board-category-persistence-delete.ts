import BoardCategoryDto from 'src/budget/models/board-category-dto';
import Changelog, { Action, EntityType } from 'src/models/changelog';
import { ChangelogBuilder } from 'src/persistence/changelog-builder';
import EntityLocalPersistence from 'src/persistence/entity-persistence';
import localDb from 'src/persistence/local-db';
import backendService from 'src/services/backend-service';

export interface DeleteBoardCategory {
  categoryId: string;
  boardId: string;
}

export class BoardCategoryDeletePersistence implements EntityLocalPersistence {
  changelogBuilder = new ChangelogBuilder();
  action!: Action;
  entityType!: EntityType;

  async createChangelogEntry(e: DeleteBoardCategory): Promise<Changelog> {
    const existingCategory = await localDb.boardCategories.get(e.categoryId);
    if (existingCategory === undefined) {
      throw Error(`Can't delete ${e.categoryId}, entry not found`);
    }
    return this.changelogBuilder.createChangelog({
      action: this.action,
      entityType: this.entityType,
      entity: existingCategory,
      entityId: e.categoryId,
      oldETag: existingCategory.etag,
      newETag: undefined,
    });
  }

  async executeIdbCollection(changelog: Changelog): Promise<void> {
    const e = changelog.payload as BoardCategoryDto;
    await localDb.boardCategories.delete(e.categoryId);
  }
  async executeRemote(changelog: Changelog, allowSSORedirect: boolean): Promise<void> {
    const e = changelog.payload as BoardCategoryDto;
    backendService
      .boardCategoryResource()
      .delete({ categoryId: e.categoryId, boardId: e.boardId, allowSSORedirect: allowSSORedirect });
  }
}
