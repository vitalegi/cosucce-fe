import { NavigationFailure, Router } from 'vue-router';

function push(router: Router, path: string): Promise<NavigationFailure | void | undefined> {
  return router.push({
    path: path,
  });
}

export class BudgetPaths {
  public static viewBoards(): string {
    return '/budget';
  }
  public static addBoard(): string {
    return `/budget/add-board`;
  }
  public static viewBoard(boardId: string): string {
    return `/budget/board/${boardId}`;
  }
  public static addBoardEntry(boardId: string): string {
    return `/budget/board/${boardId}/add-entry`;
  }
  public static editBoardEntry(boardId: string, entryId: string): string {
    return `/budget/board/${boardId}/entry/${entryId}`;
  }
  public static settingsViewAccounts(boardId: string): string {
    return `/budget/board/${boardId}/settings/accounts`;
  }
  public static settingsAddAccount(boardId: string): string {
    return `/budget/board/${boardId}/settings/add-account`;
  }
  public static settingsEditAccount(boardId: string, accountId: string): string {
    return `/budget/board/${boardId}/settings/account/${accountId}`;
  }
  public static settingsViewCategories(boardId: string): string {
    return `/budget/board/${boardId}/settings/categories`;
  }
  public static settingsAddCategory(boardId: string): string {
    return `/budget/board/${boardId}/settings/add-category`;
  }
  public static settingsEditCategory(boardId: string, categoryId: string): string {
    return `/budget/board/${boardId}/settings/category/${categoryId}`;
  }
}

export class BudgetRouting {
  public viewBoards(router: Router): Promise<NavigationFailure | void | undefined> {
    return push(router, BudgetPaths.viewBoards());
  }
  public addBoard(router: Router): Promise<NavigationFailure | void | undefined> {
    return push(router, BudgetPaths.addBoard());
  }
  public viewBoard(router: Router, boardId: string): Promise<NavigationFailure | void | undefined> {
    return push(router, BudgetPaths.viewBoard(boardId));
  }
  public addBoardEntry(
    router: Router,
    boardId: string,
  ): Promise<NavigationFailure | void | undefined> {
    return push(router, BudgetPaths.addBoardEntry(boardId));
  }
  public editBoardEntry(
    router: Router,
    boardId: string,
    entryId: string,
  ): Promise<NavigationFailure | void | undefined> {
    return push(router, BudgetPaths.editBoardEntry(boardId, entryId));
  }
  public settingsViewAccounts(
    router: Router,
    boardId: string,
  ): Promise<NavigationFailure | void | undefined> {
    return push(router, BudgetPaths.settingsViewAccounts(boardId));
  }
  public settingsAddAccount(
    router: Router,
    boardId: string,
  ): Promise<NavigationFailure | void | undefined> {
    return push(router, BudgetPaths.settingsAddAccount(boardId));
  }
  public settingsEditAccount(
    router: Router,
    boardId: string,
    accountId: string,
  ): Promise<NavigationFailure | void | undefined> {
    return push(router, BudgetPaths.settingsEditAccount(boardId, accountId));
  }
  public settingsViewCategories(
    router: Router,
    boardId: string,
  ): Promise<NavigationFailure | void | undefined> {
    return push(router, BudgetPaths.settingsViewCategories(boardId));
  }
  public settingsAddCategory(
    router: Router,
    boardId: string,
  ): Promise<NavigationFailure | void | undefined> {
    return push(router, BudgetPaths.settingsAddCategory(boardId));
  }
  public settingsEditCategory(
    router: Router,
    boardId: string,
    categoryId: string,
  ): Promise<NavigationFailure | void | undefined> {
    return push(router, BudgetPaths.settingsEditCategory(boardId, categoryId));
  }
}
