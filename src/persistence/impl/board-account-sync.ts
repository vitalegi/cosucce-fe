import BoardAccount from 'src/budget/models/board-account';
import BoardAccountDto from 'src/budget/models/board-account-dto';
import localDb from 'src/persistence/local-db';
import SyncRemoteToLocal from 'src/persistence/sync-remote-to-local';
import backendService from 'src/services/backend-service';

export default class BoardAccountSync implements SyncRemoteToLocal<BoardAccount> {
  name(): string {
    return 'BoardAccount';
  }
  async getFromRemote(): Promise<BoardAccount[]> {
    return (await backendService.boardAccountResource().getAllVisible(false)).data // //
      .map(BoardAccount.fromJson);
  }
  async getLocalIds(): Promise<string[]> {
    return (await localDb.boardAccounts.toArray()).map((b) => b.accountId);
  }
  getRemoteIds(elements: BoardAccount[]): string[] {
    return elements.map((b) => b.accountId);
  }
  deleteFromLocal(ids: string[]): Promise<void> {
    return localDb.boardAccounts.bulkDelete(ids);
  }
  async bulkPut(elements: BoardAccount[]): Promise<void> {
    await localDb.boardAccounts.bulkPut(elements.map((e) => BoardAccountDto.toDto(e)));
  }
}
