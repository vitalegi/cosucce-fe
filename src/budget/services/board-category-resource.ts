import { AxiosWrapperAuth } from 'src/services/authenticated-axios';
import { AxiosResponse } from 'axios';
import { BoardCategoryType } from 'src/budget/models/board-category';

export default class BoardCategoryResource {
  api;

  public constructor(api: AxiosWrapperAuth) {
    this.api = api;
  }

  public async getAllByBoardId(
    boardId: string,
    allowSSORedirect: boolean = true,
  ): Promise<AxiosResponse> {
    return await this.api.get(`/budget/board/${boardId}/category`, {}, allowSSORedirect);
  }
  public async getAllVisible(allowSSORedirect: boolean = true): Promise<AxiosResponse> {
    return await this.api.get(`/budget/sync/category`, {}, allowSSORedirect);
  }
  public async add({
    boardId,
    categoryId,
    label,
    type,
    icon,
    color,
    enabled,
    newETag,
    allowSSORedirect = true,
  }: {
    boardId: string;
    categoryId: string;
    label: string;
    type: BoardCategoryType;
    icon: string;
    color: string;
    enabled: boolean;
    newETag: string;
    allowSSORedirect: boolean;
  }): Promise<AxiosResponse> {
    return await this.api.post(
      `/budget/board/${boardId}/category`,
      {
        categoryId: categoryId,
        label: label,
        type: type,
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
    categoryId,
    label,
    type,
    icon,
    color,
    enabled,
    newETag,
    oldETag,
    allowSSORedirect = true,
  }: {
    boardId: string;
    categoryId: string;
    label: string;
    type: BoardCategoryType;
    icon: string;
    color: string;
    enabled: boolean;
    newETag: string;
    oldETag: string;
    allowSSORedirect: boolean;
  }): Promise<AxiosResponse> {
    return await this.api.put(
      `/budget/board/${boardId}/category`,
      {
        categoryId: categoryId,
        label: label,
        type: type,
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
    categoryId,
    allowSSORedirect = true,
  }: {
    boardId: string;
    categoryId: string;
    allowSSORedirect: boolean;
  }): Promise<AxiosResponse> {
    return await this.api.delete(
      `/budget/board/${boardId}/category/${categoryId}`,
      {},
      allowSSORedirect,
    );
  }
}
