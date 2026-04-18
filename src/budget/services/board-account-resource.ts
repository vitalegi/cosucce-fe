import { AxiosWrapperAuth } from 'src/services/authenticated-axios';
import { AxiosResponse } from 'axios';

export default class BoardAccountResource {
  api;

  public constructor(api: AxiosWrapperAuth) {
    this.api = api;
  }

  public async getAllByBoardId(
    boardId: string,
    allowSSORedirect: boolean = true,
  ): Promise<AxiosResponse> {
    return await this.api.get(`/budget/board/${boardId}/account`, {}, allowSSORedirect);
  }
  public async getAllVisible(allowSSORedirect: boolean = true): Promise<AxiosResponse> {
    return await this.api.get(`/budget/sync/account`, {}, allowSSORedirect);
  }
  public async add({
    boardId,
    accountId,
    label,
    icon,
    color,
    enabled,
    newETag,
    allowSSORedirect = true,
  }: {
    boardId: string;
    accountId: string;
    label: string;
    icon: string;
    color: string;
    enabled: boolean;
    newETag: string;
    allowSSORedirect: boolean;
  }): Promise<AxiosResponse> {
    return await this.api.post(
      `/budget/board/${boardId}/account`,
      {
        accountId: accountId,
        label: label,
        icon: icon,
        color: color,
        enabled: enabled,
        etag: newETag,
      },
      {},
      allowSSORedirect,
    );
  }
  public async update({
    boardId,
    accountId,
    label,
    icon,
    color,
    enabled,
    newETag,
    oldETag,
    allowSSORedirect = true,
  }: {
    boardId: string;
    accountId: string;
    label: string;
    icon: string;
    color: string;
    enabled: boolean;
    newETag: string;
    oldETag: string | undefined;
    allowSSORedirect: boolean;
  }): Promise<AxiosResponse> {
    return await this.api.put(
      `/budget/board/${boardId}/account`,
      {
        accountId: accountId,
        label: label,
        icon: icon,
        color: color,
        enabled: enabled,
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
  public async delete({
    boardId,
    accountId,
    allowSSORedirect = true,
  }: {
    boardId: string;
    accountId: string;
    allowSSORedirect: boolean;
  }): Promise<AxiosResponse> {
    return await this.api.delete(
      `/budget/board/${boardId}/account/${accountId}`,
      {},
      allowSSORedirect,
    );
  }
}
