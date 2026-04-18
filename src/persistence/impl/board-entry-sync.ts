import BoardEntry from 'src/budget/models/board-entry';
import BoardEntryDto from 'src/budget/models/board-entry-dto';
import localDb from 'src/persistence/local-db';
import SyncRemoteToLocal from 'src/persistence/sync-remote-to-local';
import backendService from 'src/services/backend-service';

export default class BoardEntrySync implements SyncRemoteToLocal<BoardEntry> {
  name(): string {
    return 'BoardEntry';
  }
  async getFromRemote(): Promise<BoardEntry[]> {
    return (await backendService.boardEntryResource().getAllVisible(false)).data //
      .map(BoardEntry.fromJson);
  }
  async getLocalIds(): Promise<string[]> {
    return (await localDb.boardEntries.toArray()).map((b) => b.entryId);
  }
  getRemoteIds(elements: BoardEntry[]): string[] {
    return elements.map((b) => b.entryId);
  }
  deleteFromLocal(ids: string[]): Promise<void> {
    return localDb.boardEntries.bulkDelete(ids);
  }
  async bulkPut(elements: BoardEntry[]): Promise<void> {
    await localDb.boardEntries.bulkPut(elements.map((e) => BoardEntryDto.toDto(e)));
  }
}
