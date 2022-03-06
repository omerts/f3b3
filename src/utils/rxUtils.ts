import { AnyAction } from 'redux';
import { ofType } from 'redux-observable';
import { interval, Observable, of } from 'rxjs';
import { catchError, filter, mapTo, pluck, startWith, switchMap, takeUntil } from 'rxjs/operators';

import Actions from '../actions';
import { Action, Route } from '../types';

export const getPayload = (...args: [string]) => {
  return (src: Observable<AnyAction>) =>
    src.pipe(ofType(...args), pluck('payload'))
}

export const startPolling = (
  timeInSeconds: number,
  takeUntilParam: Observable<Action>
) => {
  return (src: Observable<Action>) =>
    src.pipe(
      switchMap(payload => {
        return interval(timeInSeconds * 1000).pipe(
          takeUntil(takeUntilParam),
          mapTo(payload),
          startWith(payload)
        )
      })
    )
}

export const ofRoute = (...routes: string[]) => {
  return (src: Observable<Action>) =>
    src.pipe(
      getPayload(Actions.ROUTE_CHANGED),
      filter((location: Route) => {
        return routes?.includes(location.path)
      })
    )
}

export const catchAndDispatchError = catchError((error: Error) => {
  console.error(error)
  return of(Actions.createAction(Actions.OPERATION_FAILED, { error }))
})

export const catchAndDispatchCustomError = (error: Error) =>
  catchError(() => {
    console.error(error)
    return of(Actions.createAction(Actions.OPERATION_FAILED, { error }))
  })
