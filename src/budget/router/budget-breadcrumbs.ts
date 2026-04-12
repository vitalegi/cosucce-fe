import Breadcrumb from 'src/commons/model/breadcrumb';
import { BudgetPaths } from 'src/budget/router/budget-routing';

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
  public static addBoardEntry(boardId: string, link: boolean = true): Breadcrumb {
    return { label: 'Add', to: link ? BudgetPaths.addBoardEntry(boardId) : undefined };
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
}
