import { fromEventPattern } from 'rxjs'
import { startWith, tap, map, filter, withLatestFrom } from 'rxjs/operators'
import { Epic, ofType } from 'redux-observable'
import { Location } from 'history'
import history from '../utils/getHistory'
import Actions from '../actions'

export const routeChanged = () =>
  fromEventPattern(history.listen, (_, unlisten) => unlisten()).pipe(
    // TODO fix TS type
    map(({ location }: any) => location),
    startWith<any>(history.location),
    map((location: Location) => {
      return Actions.createAction(Actions.ROUTE_CHANGED, {
        ...location,
        path: location.pathname
      })
    })
  )

export const routeQueryUpdated: Epic = action$ => {
  const lastRoute = action$.pipe(ofType(Actions.ROUTE_CHANGED))

  return action$.pipe(
    ofType(Actions.ROUTE_UPDATED),
    withLatestFrom(lastRoute),
    map(([current, last]) => Object.assign({}, last, current)),
    tap(({ payload }) => {
      if (payload.action === 'replace') {
        history.replace(payload.path || payload.pathname, payload.state)
      } else {
        history.push(payload.path || payload.pathname, payload.state)
      }
    }),
    filter(() => false)
  )
}

export const navigateTo: Epic = action$ => {
  return action$.pipe(
    ofType(Actions.NAVIGATED_TO),
    tap(({ payload }) => {
      if (typeof payload === 'string') {
        history.push(payload)
      } else {
        history.push(payload.path || payload.pathname, payload.state)
      }
    }),
    filter(() => false)
  )
}

export const navigateBack: Epic = action$ => {
  return action$.pipe(
    ofType(Actions.NAVIGATED_BACK),
    tap(() => history.back()),
    filter(() => false)
  )
}
