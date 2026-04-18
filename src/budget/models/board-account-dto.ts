import BoardAccount from 'src/budget/models/board-account';

export default class BoardAccountDto {
  accountId = '';
  boardId = '';
  label = '';
  icon = '';
  color = '';
  enabled = true;
  etag = '';
  creationDate = '';
  lastUpdate = '';

  public static toDto(entity: BoardAccount): BoardAccountDto {
    const out = new BoardAccountDto();
    out.accountId = entity.accountId;
    out.boardId = entity.boardId;
    out.label = entity.label;
    out.icon = entity.icon;
    out.color = entity.color;
    out.enabled = entity.enabled;
    out.etag = entity.etag;
    out.creationDate = entity.creationDate.toISOString();
    out.lastUpdate = entity.lastUpdate.toISOString();
    return out;
  }
}
