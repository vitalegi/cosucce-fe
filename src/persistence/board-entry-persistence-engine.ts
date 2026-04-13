import { AxiosResponse } from 'axios';
import Changelog, { Action, EntityType } from 'src/models/changelog';
import localDb from './local-db';
import { AbstractChangelogFactory, ChangelogFactory } from './changelog/changelog-factory';
import LocalPersistence from './local/local-persistence';
import RemotePersistence from './remote/remote-persistence';
import BoardEntry from 'src/budget/models/board-entry';
import backendService from 'src/services/backend-service';

class BoardEntryChangelogFactory extends AbstractChangelogFactory<BoardEntry> {
  protected override _entityId(entity: BoardEntry): string {
    return entity.entryId;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected override _entityType(entity: BoardEntry): EntityType {
    return 'board-entry';
  }

  protected override async _oldETag(entityId: string): Promise<string | undefined> {
    const e = await localDb.boardEntries.get(entityId);
    if (e === undefined) {
      return undefined;
    }
    return BoardEntry.hash(e);
  }
  protected override _newETag(entity: BoardEntry): string {
    return BoardEntry.hash(entity);
  }
  protected override _applyETag(entity: BoardEntry, etag: string): void {
    entity.etag = etag;
  }
}

abstract class AbstractBoardEntryPersistence implements ChangelogFactory<BoardEntry> {
  private _factory;

  public constructor() {
    this._factory = new BoardEntryChangelogFactory();
  }

  async addChangelog(action: Action, entity: BoardEntry): Promise<Changelog> {
    return this._factory.addChangelog(action, entity);
  }
}

export class AddBoardEntryPersistence
  extends AbstractBoardEntryPersistence
  implements LocalPersistence<BoardEntry>, RemotePersistence
{
  async executeLocal(entity: BoardEntry): Promise<void> {
    await localDb.boardEntries.add(entity);
  }
  async executeRemote(changelog: Changelog, allowSSORedirect: boolean): Promise<AxiosResponse> {
    const entity = changelog.payload;
    return await backendService
      .boardEntryResource()
      .add(
        entity.boardId,
        entity.entryId,
        entity.date,
        entity.accountId,
        entity.categoryId,
        entity.description,
        entity.amount,
        changelog.newETag,
        allowSSORedirect,
      );
  }
}

export class UpdateBoardEntryPersistence
  extends AbstractBoardEntryPersistence
  implements LocalPersistence<BoardEntry>, RemotePersistence
{
  async executeLocal(entity: BoardEntry): Promise<void> {
    await localDb.boardEntries.put(entity);
  }
  async executeRemote(changelog: Changelog, allowSSORedirect: boolean): Promise<AxiosResponse> {
    const entity = changelog.payload;
    return await backendService
      .boardEntryResource()
      .update(
        entity.boardId,
        entity.entryId,
        entity.date,
        entity.accountId,
        entity.categoryId,
        entity.description,
        entity.amount,
        changelog.newETag,
        changelog.oldETag,
        allowSSORedirect,
      );
  }
}

export class DeleteBoardEntryPersistence
  extends AbstractBoardEntryPersistence
  implements LocalPersistence<BoardEntry>, RemotePersistence
{
  async executeLocal(entity: BoardEntry): Promise<void> {
    await localDb.boards.delete(entity.boardId);
  }
  async executeRemote(changelog: Changelog, allowSSORedirect: boolean): Promise<AxiosResponse> {
    return await backendService
      .boardEntryResource()
      .delete(changelog.payload.boardId, changelog.payload.entryId, allowSSORedirect);
  }
}
