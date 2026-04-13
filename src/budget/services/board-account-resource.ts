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
  public async add(
    boardId: string,
    accountId: string,
    label: string,
    icon: string,
    color: string,
    enabled: boolean,
    etag: string,
    allowSSORedirect: boolean = true,
  ): Promise<AxiosResponse> {
    return await this.api.post(
      `/budget/board/${boardId}/account`,
      {
        accountId: accountId,
        label: label,
        icon: icon,
        color: color,
        enabled: enabled,
        etag: etag,
      },
      {},
      allowSSORedirect,
    );
  }
  public async update(
    boardId: string,
    accountId: string,
    label: string,
    icon: string,
    color: string,
    enabled: boolean,
    newETag: string,
    oldETag: string | undefined,
    allowSSORedirect: boolean = true,
  ): Promise<AxiosResponse> {
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
  public async delete(
    boardId: string,
    accountId: string,
    allowSSORedirect: boolean = true,
  ): Promise<AxiosResponse> {
    return await this.api.delete(
      `/budget/board/${boardId}/account/${accountId}`,
      {},
      allowSSORedirect,
    );
  }
}
