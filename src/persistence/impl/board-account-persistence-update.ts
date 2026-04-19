import BoardAccountDto from 'src/budget/models/board-account-dto';
import Changelog, { Action, EntityType } from 'src/models/changelog';
import { ChangelogBuilder } from 'src/persistence/changelog-builder';
import EntityLocalPersistence from 'src/persistence/entity-persistence';
import localDb from 'src/persistence/local-db';
import backendService from 'src/services/backend-service';
import UuidUtil from 'src/utils/uuid-util';

export interface UpdateBoardAccount {
  accountId: string;
  boardId: string;
  label: string;
  icon: string;
  color: string;
  enabled: boolean;
}

export class BoardAccountUpdatePersistence implements EntityLocalPersistence {
  changelogBuilder = new ChangelogBuilder();
  action!: Action;
  entityType!: EntityType;

  async createChangelogEntry(e: UpdateBoardAccount): Promise<Changelog> {
    const entity = this.toDto(e);
    const existingAccount = await localDb.boardAccounts.get(e.accountId);
    if (existingAccount === undefined) {
      throw Error(`Can't update ${e.accountId}, account not found`);
    }
    entity.creationDate = existingAccount.creationDate;
    entity.lastUpdate = new Date().toISOString();

    return this.changelogBuilder.createChangelog({
      action: this.action,
      entityType: this.entityType,
      entity: entity,
      entityId: entity.accountId,
      dependsOn: [e.accountId],
      oldETag: existingAccount.etag,
      newETag: UuidUtil.uuid(),
    });
  }

  async executeIdbCollection(changelog: Changelog): Promise<void> {
    const e = changelog.payload as BoardAccountDto;
    await localDb.boardAccounts.update(e.accountId, e);
  }
  async executeRemote(changelog: Changelog, allowSSORedirect: boolean): Promise<void> {
    const e = changelog.payload as BoardAccountDto;
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
    backendService.boardAccountResource().update({
      accountId: e.accountId,
      boardId: e.boardId,
      label: e.label,
      icon: e.icon,
      color: e.color,
      enabled: e.enabled,
      oldETag: changelog.oldETag,
      newETag: changelog.newETag,
      allowSSORedirect: allowSSORedirect,
    });
  }

  protected toDto(entity: UpdateBoardAccount): BoardAccountDto {
    const out = new BoardAccountDto();
    out.accountId = entity.accountId;
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
