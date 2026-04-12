/* eslint-disable @typescript-eslint/no-unused-vars */
import { BudgetBreadcrumbs } from 'src/budget/router/budget-breadcrumbs';
import Breadcrumb from 'src/commons/model/breadcrumb';
import { castParamToString } from 'src/utils/params-util';
import type { RouteLocationNormalized, RouteRecordRaw } from 'vue-router';

function home(link: boolean = true): Breadcrumb {
  return { label: 'Home', icon: 'home', to: link ? '/' : undefined };
}

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/IndexPage.vue'),
        meta: {
          breadcrumbs: (route: RouteLocationNormalized) => {
            return [home(false)];
          },
        },
      },
      {
        path: 'budget',
        component: () => import('/src/budget/pages/ViewBoardsPage.vue'),
        meta: {
          breadcrumbs: (route: RouteLocationNormalized) => {
            return [home(), BudgetBreadcrumbs.viewBoards(false)];
          },
        },
      },

      {
        path: 'budget/add-board',
        component: () => import('/src/budget/pages/AddBoardPage.vue'),
        meta: {
          breadcrumbs: (route: RouteLocationNormalized) => {
            return [home(), BudgetBreadcrumbs.viewBoards(), BudgetBreadcrumbs.addBoard(false)];
          },
        },
      },
      {
        path: 'budget/board/:boardId',
        component: () => import('/src/budget/pages/BoardPage.vue'),
        meta: {
          breadcrumbs: (route: RouteLocationNormalized) => {
            const boardId = castParamToString(route.params.boardId);
            return [
              home(),
              BudgetBreadcrumbs.viewBoards(),
              BudgetBreadcrumbs.viewBoard(boardId, false),
            ];
          },
        },
      },
      {
        path: 'budget/board/:boardId/add-entry',
        component: () => import('/src/budget/pages/AddBoardEntryPage.vue'),
        meta: {
          breadcrumbs: (route: RouteLocationNormalized) => {
            const boardId = castParamToString(route.params.boardId);
            return [
              home(),
              BudgetBreadcrumbs.viewBoards(),
              BudgetBreadcrumbs.viewBoard(boardId),
              BudgetBreadcrumbs.addBoardEntry(boardId, false),
            ];
          },
        },
      },
      {
        path: 'budget/board/:boardId/settings/',
        children: [
          {
            path: 'accounts',
            component: () => import('/src/budget/pages/ViewAccountsPage.vue'),
            meta: {
              breadcrumbs: (route: RouteLocationNormalized) => {
                const boardId = castParamToString(route.params.boardId);
                return [
                  home(),
                  BudgetBreadcrumbs.viewBoards(),
                  BudgetBreadcrumbs.viewBoard(boardId),
                  BudgetBreadcrumbs.settingsViewAccounts(boardId, false),
                ];
              },
            },
          },
          {
            path: 'add-account',
            component: () => import('/src/budget/pages/AddBoardAccountPage.vue'),
            meta: {
              breadcrumbs: (route: RouteLocationNormalized) => {
                const boardId = castParamToString(route.params.boardId);
                return [
                  home(),
                  BudgetBreadcrumbs.viewBoards(),
                  BudgetBreadcrumbs.viewBoard(boardId),
                  BudgetBreadcrumbs.settingsViewAccounts(boardId),
                  BudgetBreadcrumbs.settingsAddAccount(boardId, false),
                ];
              },
            },
          },
          {
            path: 'account/:accountId',
            component: () => import('/src/budget/pages/UpdateBoardAccountPage.vue'),
            meta: {
              breadcrumbs: (route: RouteLocationNormalized) => {
                const boardId = castParamToString(route.params.boardId);
                const accountId = castParamToString(route.params.accountId);
                return [
                  home(),
                  BudgetBreadcrumbs.viewBoards(),
                  BudgetBreadcrumbs.viewBoard(boardId),
                  BudgetBreadcrumbs.settingsViewAccounts(boardId),
                  BudgetBreadcrumbs.settingsEditAccount(boardId, accountId, false),
                ];
              },
            },
          },
          {
            path: 'categories',
            component: () => import('/src/budget/pages/ViewCategoriesPage.vue'),
            meta: {
              breadcrumbs: (route: RouteLocationNormalized) => {
                const boardId = castParamToString(route.params.boardId);
                return [
                  home(),
                  BudgetBreadcrumbs.viewBoards(),
                  BudgetBreadcrumbs.viewBoard(boardId),
                  BudgetBreadcrumbs.settingsViewCategories(boardId, false),
                ];
              },
            },
          },

          {
            path: 'add-category',
            component: () => import('/src/budget/pages/AddBoardCategoryPage.vue'),
            meta: {
              breadcrumbs: (route: RouteLocationNormalized) => {
                const boardId = castParamToString(route.params.boardId);
                return [
                  home(),
                  BudgetBreadcrumbs.viewBoards(),
                  BudgetBreadcrumbs.viewBoard(boardId),
                  BudgetBreadcrumbs.settingsViewCategories(boardId),
                  BudgetBreadcrumbs.settingsAddCategory(boardId, false),
                ];
              },
            },
          },
          {
            path: 'category/:categoryId',
            component: () => import('/src/budget/pages/UpdateBoardCategoryPage.vue'),
            meta: {
              breadcrumbs: (route: RouteLocationNormalized) => {
                const boardId = castParamToString(route.params.boardId);
                const categoryId = castParamToString(route.params.categoryId);
                return [
                  home(),
                  BudgetBreadcrumbs.viewBoards(),
                  BudgetBreadcrumbs.viewBoard(boardId),
                  BudgetBreadcrumbs.settingsViewCategories(boardId),
                  BudgetBreadcrumbs.settingsEditCategory(boardId, categoryId, false),
                ];
              },
            },
          },
        ],
      },
    ],
  },
  {
    path: '/oidc/',
    component: () => import('layouts/SsoLayout.vue'),
    children: [
      {
        name: 'LoginFlow',
        path: 'login',
        component: () => import('pages/OidcLoginFlowPage.vue'),
      },
      {
        name: 'LogoutFlow',
        path: 'logout',
        component: () => import('pages/OidcLogoutFlowPage.vue'),
      },
    ],
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
