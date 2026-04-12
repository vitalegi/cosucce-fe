import { BudgetRouting } from 'src/budget/router/budget-routing';

export class Routing {
  private _budgetRouting = new BudgetRouting();

  public budget(): BudgetRouting {
    return this._budgetRouting;
  }
}

const routing = new Routing();
export default routing;
