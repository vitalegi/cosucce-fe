import BoardEntry from 'src/budget/models/board-entry';
import NumberUtil from 'src/utils/numbers/number-util';

export default class BoardEntryDto {
  entryId = '';
  boardId = '';
  date = '';
  accountId = '';
  categoryId = '';
  description = '';
  amount = '';
  lastUpdatedBy = '';
  creationDate = '';
  lastUpdate = '';
  etag = '';

  public static toDto(entity: BoardEntry): BoardEntryDto {
    const out = new BoardEntryDto();
    out.entryId = entity.entryId;
    out.boardId = entity.boardId;
    out.date = entity.date;
    out.accountId = entity.accountId;
    out.categoryId = entity.categoryId;
    out.description = entity.description;
    out.amount = NumberUtil.formatBigDecimal(entity.amount);
    out.etag = entity.etag;
    out.lastUpdatedBy = entity.lastUpdatedBy;
    out.creationDate = entity.creationDate.toISOString();
    out.lastUpdate = entity.lastUpdate.toISOString();
    return out;
  }
}
