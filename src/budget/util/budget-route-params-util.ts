import BoardCategoryType, { stringToCategoryType } from 'src/budget/models/board-category-type';
import { castParamToString } from 'src/utils/params-util';
import { RouteParams } from 'vue-router';

export function toBoardId(params: RouteParams): string {
  return castParamToString(params.boardId);
}

export function toAccountId(params: RouteParams): string {
  return castParamToString(params.accountId);
}

export function toCategoryId(params: RouteParams): string {
  return castParamToString(params.categoryId);
}

export function toEntryId(params: RouteParams): string {
  return castParamToString(params.entryId);
}

export function toCategoryType(params: RouteParams): BoardCategoryType {
  return stringToCategoryType(castParamToString(params.categoryType));
}
