import Changelog, { Action, EntityType } from 'src/models/changelog';

export default interface EntityLocalPersistence {
  action: Action;
  entityType: EntityType;

  createChangelogEntry(e: unknown): Promise<Changelog>;
  executeIdbCollection(changelog: Changelog): Promise<void>;
  executeRemote(changelog: Changelog, allowSSORedirect: boolean): Promise<void>;
}
