import { AxiosWrapperAuth } from 'src/services/authenticated-axios';
import { AxiosResponse } from 'axios';

export default class BoardEntryResource {
  api;

  public constructor(api: AxiosWrapperAuth) {
    this.api = api;
  }

  public async getAllByBoardId(
    boardId: string,
    allowSSORedirect: boolean = true,
  ): Promise<AxiosResponse> {
    return await this.api.get(`/budget/board/${boardId}/entry`, {}, allowSSORedirect);
  }
  public async getAllVisible(allowSSORedirect: boolean = true): Promise<AxiosResponse> {
    return await this.api.get(`/budget/sync/entry`, {}, allowSSORedirect);
  }
  public async add({
    boardId,
    entryId,
    date,
    accountId,
    categoryId,
    description,
    amount,
    newETag,
    allowSSORedirect = true,
  }: {
    boardId: string;
    entryId: string;
    date: string;
    accountId: string;
    categoryId: string;
    description: string;
    amount: string;
    newETag: string;
    allowSSORedirect?: boolean;
  }): Promise<AxiosResponse> {
    return await this.api.post(
      `/budget/board/${boardId}/entry`,
      {
        entryId: entryId,
        date: date,
        accountId: accountId,
        categoryId: categoryId,
        description: description,
        amount: amount,
        etag: newETag,
      },
      {},
      allowSSORedirect,
    );
  }
  public async update({
    boardId,
    entryId,
    date,
    accountId,
    categoryId,
    description,
    amount,
    newETag,
    oldETag,
    allowSSORedirect = true,
  }: {
    boardId: string;
    entryId: string;
    date: string;
    accountId: string;
    categoryId: string;
    description: string;
    amount: string;
    newETag: string;
    oldETag: string;
    allowSSORedirect?: boolean;
  }): Promise<AxiosResponse> {
    return await this.api.put(
      `/budget/board/${boardId}/entry`,
      {
        entryId: entryId,
        date: date,
        accountId: accountId,
        categoryId: categoryId,
        description: description,
        amount: amount,
        etag: newETag,
      },
      {
        headers: {
          'x-etag': oldETag,
        },
      },
      allowSSORedirect,
    );
  }
  public async delete(
    boardId: string,
    entryId: string,
    allowSSORedirect: boolean = true,
  ): Promise<AxiosResponse> {
    return await this.api.delete(`/budget/board/${boardId}/entry/${entryId}`, {}, allowSSORedirect);
  }
}
