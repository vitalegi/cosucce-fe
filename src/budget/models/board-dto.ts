import Board from 'src/budget/models/board';

export default class BoardDto {
  boardId = '';
  name = '';
  etag = '';
  creationDate = '';
  lastUpdate = '';

  public static toDto(entity: Board): BoardDto {
    const out = new BoardDto();
    out.boardId = entity.boardId;
    out.name = entity.name;
    out.etag = entity.etag;
    out.creationDate = entity.creationDate.toISOString();
    out.lastUpdate = entity.lastUpdate.toISOString();
    return out;
  }
}
