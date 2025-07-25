/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

import { Route as rootRouteImport } from './routes/__root'
import { Route as SuperSecretRouteRouteImport } from './routes/superSecretRoute'
import { Route as MenuRouteImport } from './routes/menu'
import { Route as AdminRouteImport } from './routes/admin'
import { Route as AuthRouteRouteImport } from './routes/_authRoute'
import { Route as IndexRouteImport } from './routes/index'
import { Route as AuthRouteAdminDashRouteImport } from './routes/_authRoute/admin-dash'

const SuperSecretRouteRoute = SuperSecretRouteRouteImport.update({
  id: '/superSecretRoute',
  path: '/superSecretRoute',
  getParentRoute: () => rootRouteImport,
} as any)
const MenuRoute = MenuRouteImport.update({
  id: '/menu',
  path: '/menu',
  getParentRoute: () => rootRouteImport,
} as any)
const AdminRoute = AdminRouteImport.update({
  id: '/admin',
  path: '/admin',
  getParentRoute: () => rootRouteImport,
} as any)
const AuthRouteRoute = AuthRouteRouteImport.update({
  id: '/_authRoute',
  getParentRoute: () => rootRouteImport,
} as any)
const IndexRoute = IndexRouteImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRouteImport,
} as any)
const AuthRouteAdminDashRoute = AuthRouteAdminDashRouteImport.update({
  id: '/admin-dash',
  path: '/admin-dash',
  getParentRoute: () => AuthRouteRoute,
} as any)

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/admin': typeof AdminRoute
  '/menu': typeof MenuRoute
  '/superSecretRoute': typeof SuperSecretRouteRoute
  '/admin-dash': typeof AuthRouteAdminDashRoute
}
export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/admin': typeof AdminRoute
  '/menu': typeof MenuRoute
  '/superSecretRoute': typeof SuperSecretRouteRoute
  '/admin-dash': typeof AuthRouteAdminDashRoute
}
export interface FileRoutesById {
  __root__: typeof rootRouteImport
  '/': typeof IndexRoute
  '/_authRoute': typeof AuthRouteRouteWithChildren
  '/admin': typeof AdminRoute
  '/menu': typeof MenuRoute
  '/superSecretRoute': typeof SuperSecretRouteRoute
  '/_authRoute/admin-dash': typeof AuthRouteAdminDashRoute
}
export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '/' | '/admin' | '/menu' | '/superSecretRoute' | '/admin-dash'
  fileRoutesByTo: FileRoutesByTo
  to: '/' | '/admin' | '/menu' | '/superSecretRoute' | '/admin-dash'
  id:
    | '__root__'
    | '/'
    | '/_authRoute'
    | '/admin'
    | '/menu'
    | '/superSecretRoute'
    | '/_authRoute/admin-dash'
  fileRoutesById: FileRoutesById
}
export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  AuthRouteRoute: typeof AuthRouteRouteWithChildren
  AdminRoute: typeof AdminRoute
  MenuRoute: typeof MenuRoute
  SuperSecretRouteRoute: typeof SuperSecretRouteRoute
}

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/superSecretRoute': {
      id: '/superSecretRoute'
      path: '/superSecretRoute'
      fullPath: '/superSecretRoute'
      preLoaderRoute: typeof SuperSecretRouteRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/menu': {
      id: '/menu'
      path: '/menu'
      fullPath: '/menu'
      preLoaderRoute: typeof MenuRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/admin': {
      id: '/admin'
      path: '/admin'
      fullPath: '/admin'
      preLoaderRoute: typeof AdminRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/_authRoute': {
      id: '/_authRoute'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof AuthRouteRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/_authRoute/admin-dash': {
      id: '/_authRoute/admin-dash'
      path: '/admin-dash'
      fullPath: '/admin-dash'
      preLoaderRoute: typeof AuthRouteAdminDashRouteImport
      parentRoute: typeof AuthRouteRoute
    }
  }
}

interface AuthRouteRouteChildren {
  AuthRouteAdminDashRoute: typeof AuthRouteAdminDashRoute
}

const AuthRouteRouteChildren: AuthRouteRouteChildren = {
  AuthRouteAdminDashRoute: AuthRouteAdminDashRoute,
}

const AuthRouteRouteWithChildren = AuthRouteRoute._addFileChildren(
  AuthRouteRouteChildren,
)

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  AuthRouteRoute: AuthRouteRouteWithChildren,
  AdminRoute: AdminRoute,
  MenuRoute: MenuRoute,
  SuperSecretRouteRoute: SuperSecretRouteRoute,
}
export const routeTree = rootRouteImport
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()
