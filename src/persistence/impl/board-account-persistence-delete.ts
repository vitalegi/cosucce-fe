import BoardAccountDto from 'src/budget/models/board-account-dto';
import Changelog, { Action, EntityType } from 'src/models/changelog';
import { ChangelogBuilder } from 'src/persistence/changelog-builder';
import EntityLocalPersistence from 'src/persistence/entity-persistence';
import localDb from 'src/persistence/local-db';
import backendService from 'src/services/backend-service';

export interface DeleteBoardAccount {
  accountId: string;
  boardId: string;
}

export class BoardAccountDeletePersistence implements EntityLocalPersistence {
  changelogBuilder = new ChangelogBuilder();
  action!: Action;
  entityType!: EntityType;

  async createChangelogEntry(e: DeleteBoardAccount): Promise<Changelog> {
    const existingAccount = await localDb.boardAccounts.get(e.accountId);
    if (existingAccount === undefined) {
      throw Error(`Can't delete ${e.accountId}, entry not found`);
    }
    return this.changelogBuilder.createChangelog({
      action: this.action,
      entityType: this.entityType,
      entity: existingAccount,
      entityId: e.accountId,
      dependsOn: [],
      oldETag: existingAccount.etag,
      newETag: undefined,
    });
  }

  async executeIdbCollection(changelog: Changelog): Promise<void> {
    const e = changelog.payload as BoardAccountDto;
    await localDb.boardAccounts.delete(e.accountId);
  }
  async executeRemote(changelog: Changelog, allowSSORedirect: boolean): Promise<void> {
    const e = changelog.payload as BoardAccountDto;
    await backendService
      .boardAccountResource()
      .delete({ accountId: e.accountId, boardId: e.boardId, allowSSORedirect: allowSSORedirect });
  }
}
