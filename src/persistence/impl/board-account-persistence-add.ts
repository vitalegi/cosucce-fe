import BoardAccountDto from 'src/budget/models/board-account-dto';
import Changelog, { Action, EntityType } from 'src/models/changelog';
import { ChangelogBuilder } from 'src/persistence/changelog-builder';
import EntityLocalPersistence from 'src/persistence/entity-persistence';
import localDb from 'src/persistence/local-db';
import backendService from 'src/services/backend-service';
import UuidUtil from 'src/utils/uuid-util';

export interface AddBoardAccount {
  boardId: string;
  label: string;
  icon: string;
  color: string;
  enabled: boolean;
}

export class BoardAccountAddPersistence implements EntityLocalPersistence {
  changelogBuilder = new ChangelogBuilder();
  action!: Action;
  entityType!: EntityType;

  async createChangelogEntry(e: AddBoardAccount): Promise<Changelog> {
    const entity = this.toDto(e);
    return this.changelogBuilder.createChangelog({
      action: this.action,
      entityType: this.entityType,
      entity: entity,
      entityId: entity.accountId,
      dependsOn: [e.boardId],
      oldETag: undefined,
      newETag: UuidUtil.uuid(),
    });
  }

  async executeIdbCollection(changelog: Changelog): Promise<void> {
    const e = changelog.payload as BoardAccountDto;
    await localDb.boardAccounts.add(e);
  }
  async executeRemote(changelog: Changelog, allowSSORedirect: boolean): Promise<void> {
    const e = changelog.payload as BoardAccountDto;
    if (changelog.newETag === undefined) {
      throw Error(
        `New ETag of changelog ${changelog.changelogId} is undefined (${changelog.action}, ${changelog.entityType}, ${changelog.entityId})`,
      );
    }
    backendService.boardAccountResource().add({
      boardId: e.boardId,
      accountId: e.accountId,
      label: e.label,
      icon: e.icon,
      color: e.color,
      enabled: e.enabled,
      newETag: changelog.newETag,
      allowSSORedirect: allowSSORedirect,
    });
  }

  protected toDto(entity: AddBoardAccount): BoardAccountDto {
    const out = new BoardAccountDto();
    out.accountId = UuidUtil.uuid();
    out.boardId = entity.boardId;
    out.label = entity.label;
    out.icon = entity.icon;
    out.color = entity.color;
    out.enabled = entity.enabled;
    out.etag = UuidUtil.uuid();
    out.creationDate = new Date().toISOString();
    out.lastUpdate = new Date().toISOString();
    return out;
  }
}
