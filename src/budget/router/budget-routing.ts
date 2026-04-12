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
}
