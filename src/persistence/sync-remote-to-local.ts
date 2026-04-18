export default interface SyncRemoteToLocal<E> {
  name(): string;
  getFromRemote(): Promise<E[]>;
  getLocalIds(): Promise<string[]>;
  getRemoteIds(elements: E[]): string[];
  deleteFromLocal(ids: string[]): Promise<void>;
  bulkPut(elements: E[]): Promise<void>;
}
