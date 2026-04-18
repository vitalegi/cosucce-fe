import BoardCategory from 'src/budget/models/board-category';
import BoardCategoryDto from 'src/budget/models/board-category-dto';
import localDb from 'src/persistence/local-db';
import SyncRemoteToLocal from 'src/persistence/sync-remote-to-local';
import backendService from 'src/services/backend-service';

export default class BoardCategorySync implements SyncRemoteToLocal<BoardCategory> {
  name(): string {
    return 'BoardCategory';
  }
  async getFromRemote(): Promise<BoardCategory[]> {
    return (await backendService.boardCategoryResource().getAllVisible(false)).data //
      .map(BoardCategory.fromJson);
  }
  async getLocalIds(): Promise<string[]> {
    return (await localDb.boardCategories.toArray()).map((b) => b.categoryId);
  }
  getRemoteIds(elements: BoardCategory[]): string[] {
    return elements.map((b) => b.categoryId);
  }
  deleteFromLocal(ids: string[]): Promise<void> {
    return localDb.boardCategories.bulkDelete(ids);
  }
  async bulkPut(elements: BoardCategory[]): Promise<void> {
    await localDb.boardCategories.bulkPut(elements.map((e) => BoardCategoryDto.toDto(e)));
  }
}
