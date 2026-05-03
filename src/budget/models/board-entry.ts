import { parse } from 'date-fns';
import bigDecimal from 'js-big-decimal';
import { SafeBigDecimal } from 'src/utils/numbers/safe-big-decimal';
import ObjectUtil from 'src/utils/object-util';

export default class BoardEntry {
  entryId = '';
  boardId = '';
  date = '';
  dateValue!: Date;
  accountId = '';
  categoryId = '';
  description = '';
  amount: SafeBigDecimal = new bigDecimal('0');
  lastUpdatedBy = '';
  creationDate = new Date();
  lastUpdate = new Date();
  etag = '';

  public static fromJson(obj: unknown): BoardEntry {
    const out = new BoardEntry();
    if (!obj) {
      throw new Error('Object is null');
    }
    out.entryId = ObjectUtil.propAsString(obj, 'entryId');
    out.boardId = ObjectUtil.propAsString(obj, 'boardId');
    out.date = ObjectUtil.propAsString(obj, 'date');
    out.dateValue = parse(out.date, 'yyyy-MM-dd', new Date());
    out.accountId = ObjectUtil.propAsString(obj, 'accountId');
    out.categoryId = ObjectUtil.propAsString(obj, 'categoryId');
    out.description = ObjectUtil.propAsString(obj, 'description');
    out.amount = new bigDecimal(ObjectUtil.propAsString(obj, 'amount'));
    out.lastUpdatedBy = ObjectUtil.propAsString(obj, 'lastUpdatedBy');
    out.creationDate = ObjectUtil.propAsDate(obj, 'creationDate');
    out.lastUpdate = ObjectUtil.propAsDate(obj, 'lastUpdate');
    out.etag = ObjectUtil.propAsString(obj, 'etag');
    return out;
  }
}
