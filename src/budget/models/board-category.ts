import BoardCategoryType from 'src/budget/models/board-category-type';
import ObjectUtil from 'src/utils/object-util';

export default class BoardCategory {
  categoryId = '';
  boardId = '';
  etag = '';
  label = '';
  type: BoardCategoryType = 'DEBIT';
  icon = '';
  color = '';
  enabled = true;
  creationDate = new Date();
  lastUpdate = new Date();

  public static fromJson(obj: unknown): BoardCategory {
    const out = new BoardCategory();
    if (!obj) {
      throw new Error('Object is null');
    }
    out.categoryId = ObjectUtil.propAsString(obj, 'categoryId');
    out.boardId = ObjectUtil.propAsString(obj, 'boardId');
    out.etag = ObjectUtil.propAsString(obj, 'etag');
    out.label = ObjectUtil.propAsString(obj, 'label');
    const type = ObjectUtil.propAsString(obj, 'type');
    if (type === 'CREDIT' || type === 'DEBIT') {
      out.type = type;
    } else {
      throw Error(`Category type ${type} is unknown`);
    }
    out.icon = ObjectUtil.propAsString(obj, 'icon');
    out.color = ObjectUtil.propAsString(obj, 'color');
    out.enabled = ObjectUtil.propAsBoolean(obj, 'enabled');
    out.creationDate = ObjectUtil.propAsDate(obj, 'creationDate');
    out.lastUpdate = ObjectUtil.propAsDate(obj, 'lastUpdate');
    return out;
  }
}
