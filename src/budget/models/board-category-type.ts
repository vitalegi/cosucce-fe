type BoardCategoryType = 'CREDIT' | 'DEBIT';

export default BoardCategoryType;

export function stringToCategoryType(value: string): BoardCategoryType {
  if (value.toUpperCase() === 'CREDIT') {
    return 'CREDIT';
  }
  if (value.toUpperCase() === 'DEBIT') {
    return 'DEBIT';
  }
  throw Error(`Value '${value}' is not a valid category type`);
}
