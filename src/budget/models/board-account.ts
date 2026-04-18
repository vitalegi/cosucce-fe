import ObjectUtil from 'src/utils/object-util';

export default class BoardAccount {
  accountId = '';
  boardId = '';
  label = '';
  icon = '';
  color = '';
  enabled = true;
  etag = '';
  creationDate = new Date();
  lastUpdate = new Date();

  public static fromJson(obj: unknown): BoardAccount {
    const out = new BoardAccount();
    if (!obj) {
      throw new Error('Object is null');
    }
    out.accountId = ObjectUtil.propAsString(obj, 'accountId');
    out.boardId = ObjectUtil.propAsString(obj, 'boardId');
    out.label = ObjectUtil.propAsString(obj, 'label');
    out.icon = ObjectUtil.propAsString(obj, 'icon');
    out.color = ObjectUtil.propAsString(obj, 'color');
    out.enabled = ObjectUtil.propAsBoolean(obj, 'enabled');
    out.etag = ObjectUtil.propAsString(obj, 'etag');
    out.creationDate = ObjectUtil.propAsDate(obj, 'creationDate');
    out.lastUpdate = ObjectUtil.propAsDate(obj, 'lastUpdate');
    return out;
  }
}
