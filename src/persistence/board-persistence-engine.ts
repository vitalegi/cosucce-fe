import { AxiosResponse } from 'axios';
import Board from 'src/budget/models/board';
import Changelog, { Action, EntityType } from 'src/models/changelog';
import localDb from './local-db';
import { AbstractChangelogFactory, ChangelogFactory } from './changelog/changelog-factory';
import LocalPersistence from './local/local-persistence';
import RemotePersistence from './remote/remote-persistence';
import backendService from 'src/services/backend-service';

class BoardChangelogFactory extends AbstractChangelogFactory<Board> {
  protected override _entityId(entity: Board): string {
    return entity.boardId;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected override _entityType(entity: Board): EntityType {
    return 'board';
  }

  protected override async _oldETag(entityId: string): Promise<string | undefined> {
    const e = await localDb.boards.get(entityId);
    if (e === undefined) {
      return undefined;
    }
    return e.etag;
  }
  protected override _newETag(entity: Board): string {
    return Board.hash(entity);
  }
  protected override _applyETag(entity: Board, etag: string): void {
    entity.etag = etag;
  }
}

abstract class AbstractBoardPersistence implements ChangelogFactory<Board> {
  private _factory;

  public constructor() {
    this._factory = new BoardChangelogFactory();
  }

  async addChangelog(action: Action, entity: Board): Promise<Changelog> {
    return this._factory.addChangelog(action, entity);
  }
}

export class AddBoardPersistence
  extends AbstractBoardPersistence
  implements LocalPersistence<Board>, RemotePersistence
{
  async executeLocal(entity: Board): Promise<void> {
    await localDb.boards.add(entity);
  }
  async executeRemote(changelog: Changelog, allowSSORedirect: boolean): Promise<AxiosResponse> {
    const entity = changelog.payload;
    return await backendService
      .boardResource()
      .add(entity.boardId, entity.name, changelog.newETag, allowSSORedirect);
  }
}

export class UpdateBoardPersistence
  extends AbstractBoardPersistence
  implements LocalPersistence<Board>, RemotePersistence
{
  async executeLocal(entity: Board): Promise<void> {
    await localDb.boards.put(entity);
  }
  async executeRemote(changelog: Changelog, allowSSORedirect: boolean): Promise<AxiosResponse> {
    const entity = changelog.payload;
    return await backendService
      .boardResource()
      .update(entity.boardId, entity.name, changelog.newETag, changelog.oldETag, allowSSORedirect);
  }
}

export class DeleteBoardPersistence
  extends AbstractBoardPersistence
  implements LocalPersistence<Board>, RemotePersistence
{
  public constructor() {
    super();
  }

  async executeLocal(entity: Board): Promise<void> {
    await localDb.boards.delete(entity.boardId);
  }
  async executeRemote(changelog: Changelog, allowSSORedirect: boolean): Promise<AxiosResponse> {
    return await backendService.boardResource().delete(changelog.payload.boardId, allowSSORedirect);
  }
}
