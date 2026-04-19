import BoardCategory from 'src/budget/models/board-category';
import BoardCategoryType from 'src/budget/models/board-category-type';

export default class BoardCategoryDto {
  categoryId = '';
  boardId = '';
  label = '';
  icon = '';
  color = '';
  enabled = true;
  type: BoardCategoryType = 'CREDIT';
  etag = '';
  creationDate = '';
  lastUpdate = '';

  public static toDto(entity: BoardCategory): BoardCategoryDto {
    const out = new BoardCategoryDto();
    out.categoryId = entity.categoryId;
    out.boardId = entity.boardId;
    out.label = entity.label;
    out.icon = entity.icon;
    out.color = entity.color;
    out.enabled = entity.enabled;
    out.type = entity.type;
    out.etag = entity.etag;
    out.creationDate = entity.creationDate.toISOString();
    out.lastUpdate = entity.lastUpdate.toISOString();
    return out;
  }
}
