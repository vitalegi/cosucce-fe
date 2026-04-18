import Board from 'src/budget/models/board';
import BoardDto from 'src/budget/models/board-dto';
import localDb from 'src/persistence/local-db';
import SyncRemoteToLocal from 'src/persistence/sync-remote-to-local';
import backendService from 'src/services/backend-service';

export default class BoardSync implements SyncRemoteToLocal<Board> {
  name(): string {
    return 'Board';
  }
  async getFromRemote(): Promise<Board[]> {
    return (await backendService.boardResource().getAllVisible()).data.map(Board.fromJson);
  }
  async getLocalIds(): Promise<string[]> {
    return (await localDb.boards.toArray()).map((b) => b.boardId);
  }
  getRemoteIds(elements: Board[]): string[] {
    return elements.map((b) => b.boardId);
  }
  deleteFromLocal(ids: string[]): Promise<void> {
    return localDb.boards.bulkDelete(ids);
  }
  async bulkPut(elements: Board[]): Promise<void> {
    await localDb.boards.bulkPut(elements.map((e) => BoardDto.toDto(e)));
  }
}
