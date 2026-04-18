/*import Changelog, { Action, EntityType } from 'src/models/changelog';
import localDb from './local-db';
import { AbstractChangelogFactory, ChangelogFactory } from './changelog/changelog-factory';
import LocalPersistence from './local/local-persistence';
import RemotePersistence from './remote/remote-persistence';
import BoardAccount from 'src/budget/models/board-account';
import backendService from 'src/services/backend-service';
import { AxiosResponse } from 'axios';

class BoardAccountChangelogFactory extends AbstractChangelogFactory<BoardAccount> {
  protected override _entityId(entity: BoardAccount): string {
    return entity.accountId;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected override _entityType(entity: BoardAccount): EntityType {
    return 'board-account';
  }

  protected override async _oldETag(entityId: string): Promise<string | undefined> {
    const e = await localDb.boardAccounts.get(entityId);
    if (e === undefined) {
      return undefined;
    }
    return e.etag;
  }
  protected override _newETag(entity: BoardAccount): string {
    return BoardAccount.hash(entity);
  }
  protected override _applyETag(entity: BoardAccount, etag: string): void {
    entity.etag = etag;
  }
}

abstract class AbstractBoardAccountPersistence implements ChangelogFactory<BoardAccount> {
  private _factory;

  public constructor() {
    this._factory = new BoardAccountChangelogFactory();
  }

  async addChangelog(action: Action, entity: BoardAccount): Promise<Changelog> {
    return this._factory.addChangelog(action, entity);
  }
}

export class AddBoardAccountPersistence
  extends AbstractBoardAccountPersistence
  implements LocalPersistence<BoardAccount>, RemotePersistence
{
  public constructor() {
    super();
  }

  async executeLocal(entity: BoardAccount): Promise<void> {
    await localDb.boardAccounts.add(entity);
  }
  async executeRemote(changelog: Changelog, allowSSORedirect: boolean): Promise<AxiosResponse> {
    const entity = changelog.payload;
    return await backendService
      .boardAccountResource()
      .add(
        entity.boardId,
        entity.accountId,
        entity.label,
        entity.icon,
        entity.color,
        entity.enabled,
        entity.etag,
        allowSSORedirect,
      );
  }
}

export class UpdateBoardAccountPersistence
  extends AbstractBoardAccountPersistence
  implements LocalPersistence<BoardAccount>, RemotePersistence
{
  public constructor() {
    super();
  }
  async executeLocal(entity: BoardAccount): Promise<void> {
    await localDb.boardAccounts.put(entity);
  }
  async executeRemote(changelog: Changelog, allowSSORedirect: boolean): Promise<AxiosResponse> {
    const entity = changelog.payload;
    return await backendService
      .boardAccountResource()
      .update(
        entity.boardId,
        entity.accountId,
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

export class DeleteBoardAccountPersistence
  extends AbstractBoardAccountPersistence
  implements LocalPersistence<BoardAccount>, RemotePersistence
{
  public constructor() {
    super();
  }

  async executeLocal(entity: BoardAccount): Promise<void> {
    await localDb.boards.delete(entity.boardId);
  }
  async executeRemote(changelog: Changelog, allowSSORedirect: boolean): Promise<AxiosResponse> {
    return await backendService
      .boardAccountResource()
      .delete(changelog.payload.boardId, changelog.payload.entryId, allowSSORedirect);
  }
}

*/
