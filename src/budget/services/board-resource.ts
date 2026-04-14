import { AxiosWrapperAuth } from 'src/services/authenticated-axios';
import { AxiosResponse } from 'axios';

export default class BoardResource {
  api;

  public constructor(api: AxiosWrapperAuth) {
    this.api = api;
  }

  public async getAllVisible(allowSSORedirect: boolean = true): Promise<AxiosResponse> {
    return await this.api.get(`/budget/sync/board`, {}, allowSSORedirect);
  }
  public async add(
    boardId: string,
    name: string,
    etag: string,
    allowSSORedirect: boolean = true,
  ): Promise<AxiosResponse> {
    return await this.api.post(
      `/budget/board`,
      {
        boardId: boardId,
        name: name,
        etag: etag,
      },
      {},
      allowSSORedirect,
    );
  }
  public async update(
    boardId: string,
    name: string,
    newETag: string,
    oldETag: string | undefined,
    allowSSORedirect: boolean = true,
  ): Promise<AxiosResponse> {
    return await this.api.put(
      `/budget/board/${boardId}`,
      {
        boardId: boardId,
        name: name,
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
  public async delete(boardId: string, allowSSORedirect: boolean = true): Promise<AxiosResponse> {
    return await this.api.delete(`/budget/board/${boardId}`, {}, allowSSORedirect);
  }
}
