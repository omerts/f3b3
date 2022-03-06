import { AnyAction } from 'redux';
import { Epic } from 'redux-observable';
import { from, Observable } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';

import Actions from '../actions';
import { Route } from '../types';
import { isMatch } from '../utils/routing';
import { catchAndDispatchError, getPayload } from '../utils/rxUtils';

export interface RouteCallbackParam {
  route: Route
  pathParams: Object
}

export interface RegisterRouteParams {
  path: string
  callback: (params: RouteCallbackParam) => AnyAction | AnyAction[]
  notPath?: string
  exactMatch?: boolean
  oneTimeOnly?: boolean
  resetOneTimeRoute?: string
}

interface InternalRegisterRouteParams extends RegisterRouteParams {
  _didRun?: boolean
}

// TODO find a more functional approach
const routeConfig: InternalRegisterRouteParams[] = []

export const registerRoute = (registerParams: RegisterRouteParams) => {
  routeConfig.push(registerParams)
}

// ==================== No need to touch below this line ==================================================

const runRouteAction = (route: Route) => {
  return routeConfig.reduce(
    (actions: AnyAction[], registerParams: InternalRegisterRouteParams) => {
      if (
        registerParams.oneTimeOnly &&
        registerParams._didRun &&
        registerParams.resetOneTimeRoute
      ) {
        if (isMatch(registerParams.resetOneTimeRoute, route.path)) {
          registerParams._didRun = false

          // After reset don't run the check for current route
          return actions
        }
      }

      if (registerParams.notPath) {
        const matched = isMatch(registerParams.notPath, route.path)

        if (matched) {
          return actions
        }
      }

      if (registerParams.oneTimeOnly && registerParams._didRun) {
        return actions
      }

      const matched = isMatch(
        registerParams.path,
        route.path,
        registerParams.exactMatch
      )

      if (matched) {
        // Query contains search parameters, aka ?a=1&b=2, matched contains parameters from the
        // route, aka /cases/zoom/:targetId.
        const result = registerParams.callback({
          route,
          pathParams: matched
        })

        if (registerParams.oneTimeOnly) {
          registerParams._didRun = true
        }

        if (result) {
          return actions.concat(result)
        }
      }

      return actions
    },
    []
  )
}

export const route: Epic = (action$: Observable<AnyAction>) => {
  return action$.pipe(
    getPayload(Actions.ROUTE_CHANGED),
    filter(
      (payload: Route) => !payload.state || !payload.state.skipRouterService
    ),
    map((payload: Route) => runRouteAction(payload)),
    filter(result => !!result),
    switchMap((result: AnyAction[]) => {
      return from(result).pipe(catchAndDispatchError)
    })
  )
}

export default route
