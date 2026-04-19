import Changelog, { Action, EntityType } from 'src/models/changelog';

export interface ChangelogRequest {
  action: Action;
  entityType: EntityType;
  entity: unknown;
  entityId: string;
  dependsOn: string[];
  oldETag: string | undefined;
  newETag: string | undefined;
}

export class ChangelogBuilder {
  public createChangelog({
    action,
    entityType,
    entity,
    entityId,
    dependsOn,
    oldETag,
    newETag,
  }: ChangelogRequest): Changelog {
    const changelog = new Changelog();
    changelog.entityId = entityId;
    changelog.action = action;
    changelog.entityType = entityType;
    changelog.oldETag = oldETag;
    changelog.newETag = newETag;
    changelog.dependsOn = dependsOn;
    changelog.payload = entity;
    changelog.status = 'new';
    changelog.creationDate = new Date();
    changelog.lastUpdate = new Date();
    return changelog;
  }
}
