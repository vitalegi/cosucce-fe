import Changelog, { Action, EntityType } from 'src/models/changelog';

export default interface EntityRemotePersistence {
  action(): Action;
  entityType(): EntityType;
  executeRemote(changelog: Changelog): Promise<void>;
}
