import Breadcrumb from 'src/commons/model/breadcrumb';
import { BudgetPaths } from 'src/budget/router/budget-routing';
import BoardCategoryType from 'src/budget/models/board-category-type';

export class BudgetBreadcrumbs {
  public static viewBoards(link: boolean = true): Breadcrumb {
    return { label: 'Boards', to: link ? BudgetPaths.viewBoards() : undefined };
  }
  public static addBoard(link: boolean = true): Breadcrumb {
    return { label: 'Board', to: link ? BudgetPaths.addBoard() : undefined };
  }
  public static viewBoard(boardId: string, link: boolean = true): Breadcrumb {
    return { label: 'Board', to: link ? BudgetPaths.viewBoard(boardId) : undefined };
  }
  public static addBoardEntry(
    boardId: string,
    categoryType: BoardCategoryType,
    link: boolean = true,
  ): Breadcrumb {
    let label = '';
    if (categoryType === 'CREDIT') {
      label = 'Add Credit';
    }
    if (categoryType === 'DEBIT') {
      label = 'Add Debit';
    }
    return {
      label: label,
      to: link ? BudgetPaths.addBoardEntry(boardId, categoryType) : undefined,
    };
  }
  public static updateBoardEntry(
    boardId: string,
    entryId: string,
    link: boolean = true,
  ): Breadcrumb {
    return { label: 'Edit', to: link ? BudgetPaths.editBoardEntry(boardId, entryId) : undefined };
  }
  public static settingsViewAccounts(boardId: string, link: boolean = true): Breadcrumb {
    return { label: 'Accounts', to: link ? BudgetPaths.settingsViewAccounts(boardId) : undefined };
  }
  public static settingsAddAccount(boardId: string, link: boolean = true): Breadcrumb {
    return { label: 'Add', to: link ? BudgetPaths.settingsAddAccount(boardId) : undefined };
  }
  public static settingsEditAccount(
    boardId: string,
    accountId: string,
    link: boolean = true,
  ): Breadcrumb {
    return {
      label: 'Edit',
      to: link ? BudgetPaths.settingsEditAccount(boardId, accountId) : undefined,
    };
  }
  public static settingsViewCategories(boardId: string, link: boolean = true): Breadcrumb {
    return {
      label: 'Categories',
      to: link ? BudgetPaths.settingsViewCategories(boardId) : undefined,
    };
  }
  public static settingsAddCategory(boardId: string, link: boolean = true): Breadcrumb {
    return { label: 'Add', to: link ? BudgetPaths.settingsAddCategory(boardId) : undefined };
  }
  public static settingsEditCategory(
    boardId: string,
    categoryId: string,
    link: boolean = true,
  ): Breadcrumb {
    return {
      label: 'Edit',
      to: link ? BudgetPaths.settingsEditCategory(boardId, categoryId) : undefined,
    };
  }
  public static settingsBudgetAdmin(boardId: string, link: boolean = true): Breadcrumb {
    return {
      label: 'Admin',
      to: link ? BudgetPaths.settingsBudgetAdmin(boardId) : undefined,
    };
  }
}
