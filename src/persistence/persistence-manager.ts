import Changelog, { Action, ChangelogStatus, EntityType } from 'src/models/changelog';
import { BoardEntryAddPersistence } from 'src/persistence/impl/board-entry-persistence-add';
import { BoardEntryDeletePersistence } from 'src/persistence/impl/board-entry-persistence-delete';
import { BoardEntryUpdatePersistence } from 'src/persistence/impl/board-entry-persistence-update';
import EntityLocalPersistence from 'src/persistence/entity-persistence';
import localDb from 'src/persistence/local-db';
import TimeUtil from 'src/utils/time-util';
import SyncRemoteToLocal from 'src/persistence/sync-remote-to-local';
import BoardEntrySync from 'src/persistence/impl/board-entry-sync';
import SetUtil from 'src/utils/set-util';
import { BoardAccountAddPersistence } from 'src/persistence/impl/board-account-persistence-add';
import { BoardAccountUpdatePersistence } from 'src/persistence/impl/board-account-persistence-update';
import { BoardAccountDeletePersistence } from 'src/persistence/impl/board-account-persistence-delete';
import { BoardCategoryAddPersistence } from 'src/persistence/impl/board-category-persistence-add';
import { BoardCategoryDeletePersistence } from 'src/persistence/impl/board-category-persistence-delete';
import { BoardCategoryUpdatePersistence } from 'src/persistence/impl/board-category-persistence-update';
import BoardSync from 'src/persistence/impl/board-sync';
import BoardAccountSync from 'src/persistence/impl/board-account-sync';
import BoardCategorySync from 'src/persistence/impl/board-category-sync';
import { BoardAddPersistence } from 'src/persistence/impl/board-persistence-add';
import { BoardDeletePersistence } from 'src/persistence/impl/board-persistence-delete';
import { BoardUpdatePersistence } from 'src/persistence/impl/board-persistence-update';
import ObjectUtil from 'src/utils/object-util';
import { useUserStore } from 'src/stores/user-store';
import { date } from 'quasar';

type Persistence = {
  action: Action;
  entityType: EntityType;
  local: EntityLocalPersistence;
};

function p(action: Action, entityType: EntityType, local: EntityLocalPersistence): Persistence {
  local.action = action;
  local.entityType = entityType;
  return {
    action: action,
    entityType: entityType,
    local: local,
  };
}

export class PersistenceManager {
  private persistors: Persistence[];
  private synchronizers: SyncRemoteToLocal<unknown>[];

  constructor() {
    this.persistors = new Array<Persistence>();

    this.persistors.push(p('add', 'board', new BoardAddPersistence()));
    this.persistors.push(p('update', 'board', new BoardUpdatePersistence()));
    this.persistors.push(p('delete', 'board', new BoardDeletePersistence()));

    this.persistors.push(p('add', 'board-entry', new BoardEntryAddPersistence()));
    this.persistors.push(p('update', 'board-entry', new BoardEntryUpdatePersistence()));
    this.persistors.push(p('delete', 'board-entry', new BoardEntryDeletePersistence()));

    this.persistors.push(p('add', 'board-account', new BoardAccountAddPersistence()));
    this.persistors.push(p('update', 'board-account', new BoardAccountUpdatePersistence()));
    this.persistors.push(p('delete', 'board-account', new BoardAccountDeletePersistence()));

    this.persistors.push(p('add', 'board-category', new BoardCategoryAddPersistence()));
    this.persistors.push(p('update', 'board-category', new BoardCategoryUpdatePersistence()));
    this.persistors.push(p('delete', 'board-category', new BoardCategoryDeletePersistence()));

    this.synchronizers = new Array<SyncRemoteToLocal<unknown>>();
    this.synchronizers.push(new BoardSync());
    this.synchronizers.push(new BoardAccountSync());
    this.synchronizers.push(new BoardCategorySync());
    this.synchronizers.push(new BoardEntrySync());
  }

  public async add(action: Action, entityType: EntityType, entity: unknown): Promise<string> {
    const persistor = this.getPersistor(action, entityType);
    const changelog = await persistor.createChangelogEntry(entity);
    await this.addChangelog(changelog);
    await persistor.executeIdbCollection(changelog);
    return changelog.entityId;
  }

  public async syncRemote(): Promise<void> {
    try {
      const userStore = useUserStore();
      if (!userStore.authenticated) {
        console.debug('Not authenticated, skip');
        return;
      }
      this.pushChangelogs();

      const lastRemoteSync = window.localStorage.getItem('last_remote_sync');
      if (lastRemoteSync != null) {
        const lastRemoteSyncDate = new Date(Date.parse(lastRemoteSync));
        const ref = new Date();
        const diff = date.getDateDiff(ref, lastRemoteSyncDate, 'minutes');
        if (diff < 1) {
          return;
        }
      }
      window.localStorage.setItem('last_remote_sync', new Date().toISOString());

      console.debug('synchronize start');
      const start = TimeUtil.ts();
      for (const synchronizer of this.synchronizers) {
        await this.synchronize(synchronizer);
      }
      console.log(`synchronize done in ${TimeUtil.ts() - start}ms`);
    } catch (e) {
      const code = this.getErrorCode(e);
      if (code === 'unauthorized') {
        return;
      }
      throw e;
    }
  }

  protected async pushChangelogs(): Promise<void> {
    const start = TimeUtil.ts();
    const changes = (await localDb.changelogs.toArray())
      .filter((e) => e.status !== 'done')
      .sort((a, b) => Changelog.sortById(a, b));
    console.log(`Found ${changes.length} changeset to sync - ${TimeUtil.ts() - start}ms`);

    try {
      for (const c of changes) {
        const result = await this.pushChangelog(c);
        if (result === 'unauthorized') {
          console.log('Unauthorized, stop sync');
          return;
        }
      }
    } finally {
      console.log(`Changelog boards done - ${TimeUtil.ts() - start}ms`);
    }
  }

  protected async pushChangelog(changelog: Changelog): Promise<ChangelogStatus> {
    if (changelog.changelogId === undefined) {
      throw Error(`Missing changelogId on ${Changelog.toString(changelog)}`);
    }
    if (changelog.dependsOn.length > 0) {
      const dependencies = (await localDb.changelogs
        .where('entityId')
        .anyOfIgnoreCase(changelog.dependsOn)
        .toArray()) as Changelog[];
      for (const dependency of dependencies) {
        if (dependency.status !== 'done' && dependency.changelogId < changelog.changelogId) {
          console.log(
            `Changelog ${Changelog.toString(changelog)} depends on ${Changelog.toString(dependency)}, wait completion`,
          );
          return 'new';
        }
      }
    }
    try {
      const engine = this.getPersistor(changelog.action, changelog.entityType);
      await engine.executeRemote(changelog, false);
      console.debug(`Changelog synchronized ${Changelog.toString(changelog)}.`);
      await localDb.changelogs.delete(changelog.changelogId);
      return 'done';
    } catch (e) {
      const code = this.getErrorCode(e);
      if (code !== 'unauthorized') {
        console.error(`Error while pushing to remote: ${Changelog.toString(changelog)}`, e);
      }
      await localDb.changelogs.update(changelog.changelogId, {
        status: code,
        lastUpdate: new Date(),
      });
      return code;
    }
  }

  protected async synchronize<E>(sync: SyncRemoteToLocal<E>): Promise<void> {
    const start = TimeUtil.ts();
    let partial = TimeUtil.ts();
    console.debug(`${sync.name()} - import start`);
    const remoteElements = await sync.getFromRemote();
    console.debug(
      `${sync.name()} - downloaded ${remoteElements.length} elements from remote in ${TimeUtil.ts() - partial}ms`,
    );

    partial = TimeUtil.ts();
    const localIds = await sync.getLocalIds();
    const remoteIds = sync.getRemoteIds(remoteElements);

    const toBeDeleted = SetUtil.subtract(localIds, remoteIds);
    console.debug(
      `${sync.name()} - identified ${toBeDeleted.length} local elements to be deleted - ${TimeUtil.ts() - partial}ms`,
    );

    partial = TimeUtil.ts();
    await sync.deleteFromLocal(toBeDeleted);
    console.debug(
      `${sync.name()} - deleted ${toBeDeleted.length} local elements - ${TimeUtil.ts() - partial}ms`,
    );

    partial = TimeUtil.ts();
    await sync.bulkPut(remoteElements);
    console.debug(
      `${sync.name()} - imported ${remoteElements.length} elements locally - ${TimeUtil.ts() - partial}ms`,
    );
    console.log(`${sync.name()} - import done - ${TimeUtil.ts() - start}ms`);
  }

  protected getPersistor(action: Action, entityType: EntityType): EntityLocalPersistence {
    return this.persistors
      .filter((e) => e.action === action)
      .filter((e) => e.entityType === entityType)[0].local;
  }

  protected async addChangelog(changelog: Changelog): Promise<Changelog> {
    const id = await localDb.changelogs.put(changelog);
    console.log(
      `Added new entry ${changelog.action} ${changelog.entityType} ${changelog.entityId} to changelog, id: ${id}`,
    );
    const entry = await localDb.changelogs.get(id);
    if (!entry) {
      throw new Error('Changelog insert failed');
    }
    return entry;
  }

  protected getErrorCode(e: unknown): ChangelogStatus {
    const code = ObjectUtil.propAsInt(e, 'status', 500);
    switch (code) {
      case 200:
        return 'done';
      case 201:
        return 'done';
      case 401:
        return 'unauthorized';
      case 403:
        return 'forbidden';
      case 409:
        return 'conflict';
      default:
        return 'generic-error';
    }
  }
}

const persistenceManager = new PersistenceManager();
export default persistenceManager;
