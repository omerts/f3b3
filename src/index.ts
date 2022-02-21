export { Epic, StateObservable, createEpicMiddleware } from 'redux-observable'
export { Draft } from 'immer'
export { Action, Route, OperationFailedPayload } from './types'
export { RouteCallbackParam, RegisterRouteParams } from './epics/routerEpic'
export { ModelReducers, CreateModelParams } from './createModel'
import reducerManager from './reducerManager'
export * from './utils'
export * from './createModel'
export * from './actions'
export * from './components'
export * from './hooks'
export { rootEpic } from './epics'

export const reduce = reducerManager.reduce
