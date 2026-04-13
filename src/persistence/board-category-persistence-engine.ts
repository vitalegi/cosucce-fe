import { AxiosResponse } from 'axios';
import Changelog, { Action, EntityType } from 'src/models/changelog';
import localDb from './local-db';
import { AbstractChangelogFactory, ChangelogFactory } from './changelog/changelog-factory';
import LocalPersistence from './local/local-persistence';
import RemotePersistence from './remote/remote-persistence';
import BoardCategory from 'src/budget/models/board-category';
import backendService from 'src/services/backend-service';

class BoardCategoryChangelogFactory extends AbstractChangelogFactory<BoardCategory> {
  protected override _entityId(entity: BoardCategory): string {
    return entity.categoryId;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected override _entityType(entity: BoardCategory): EntityType {
    return 'board-category';
  }

  protected override async _oldETag(entityId: string): Promise<string | undefined> {
    const e = await localDb.boardCategories.get(entityId);
    if (e === undefined) {
      return undefined;
    }
    return BoardCategory.hash(e);
  }
  protected override _newETag(entity: BoardCategory): string {
    return BoardCategory.hash(entity);
  }
  protected override _applyETag(entity: BoardCategory, etag: string): void {
    entity.etag = etag;
  }
}

abstract class AbstractBoardCategoryPersistence implements ChangelogFactory<BoardCategory> {
  private _factory;

  public constructor() {
    this._factory = new BoardCategoryChangelogFactory();
  }

  async addChangelog(action: Action, entity: BoardCategory): Promise<Changelog> {
    return this._factory.addChangelog(action, entity);
  }
}

export class AddBoardCategoryPersistence
  extends AbstractBoardCategoryPersistence
  implements LocalPersistence<BoardCategory>, RemotePersistence
{
  public constructor() {
    super();
  }

  async executeLocal(entity: BoardCategory): Promise<void> {
    await localDb.boardCategories.add(entity);
  }
  async executeRemote(changelog: Changelog, allowSSORedirect: boolean): Promise<AxiosResponse> {
    const entity = changelog.payload;
    return await backendService
      .boardCategoryResource()
      .add(
        entity.boardId,
        entity.categoryId,
        entity.label,
        entity.icon,
        entity.color,
        entity.enabled,
        changelog.newETag,
        allowSSORedirect,
      );
  }
}

export class UpdateBoardCategoryPersistence
  extends AbstractBoardCategoryPersistence
  implements LocalPersistence<BoardCategory>, RemotePersistence
{
  public constructor() {
    super();
  }
  async executeLocal(entity: BoardCategory): Promise<void> {
    await localDb.boardCategories.put(entity);
  }
  async executeRemote(changelog: Changelog, allowSSORedirect: boolean): Promise<AxiosResponse> {
    const entity = changelog.payload;
    return await backendService
      .boardCategoryResource()
      .update(
        entity.boardId,
        entity.categoryId,
        entity.label,
        entity.icon,
        entity.color,
        entity.enabled,
        changelog.newETag,
        changelog.oldETag,
        allowSSORedirect,
      );
  }
}

export class DeleteBoardCategoryPersistence
  extends AbstractBoardCategoryPersistence
  implements LocalPersistence<BoardCategory>, RemotePersistence
{
  public constructor() {
    super();
  }

  async executeLocal(entity: BoardCategory): Promise<void> {
    await localDb.boards.delete(entity.boardId);
  }
  async executeRemote(changelog: Changelog, allowSSORedirect: boolean): Promise<AxiosResponse> {
    return await await backendService
      .boardCategoryResource()
      .delete(changelog.payload.boardId, changelog.payload.entryId, allowSSORedirect);
  }
}
