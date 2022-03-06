import produce, { Draft } from 'immer';
import { AnyAction } from 'redux';
import { Epic } from 'redux-observable';

import { registerEpics } from './epics';
import { registerRoute, RegisterRouteParams } from './epics/routerEpic';
import reducerManager from './reducerManager';
import { isMatch } from './utils/routing';

export interface ModelReducers<T> {
  [actionType: string]: (state: Draft<T>, action: AnyAction) => void
}

export interface CreateModelParams<T> {
  key: string
  initialState: T
  route?: string
  initActions?: RegisterRouteParams[]
  epics?: Epic[]
  reducers?: ModelReducers<T>
}

const buildReducersThunk = <T>(params: CreateModelParams<T>) => {
  return produce((draft, action) => {
    // If we are not on the configured route, do nothing
    // Using window.location is a hack until history fix there bug, i opened an issue here:
    // https://github.com/remix-run/history/issues/895
    if (params.route && !isMatch(params.route, window.location.pathname)) {
      return
    }

    if (params.reducers) {
      Object.entries(params.reducers).forEach(([key, value]) => {
        if (action.type === key) {
          value(draft, action)
        }
      })
    }
  }, params.initialState)
}

export const createModel = <T>(params: CreateModelParams<T>) => {
  params.initActions?.forEach((initAction: RegisterRouteParams) =>
    registerRoute(initAction)
  )

  if (params.epics?.length) {
    registerEpics(...params.epics)
  }

  // Todo add support for removing reducer according to route
  return reducerManager.add(params.key, buildReducersThunk<T>(params))
}

export default createModel
