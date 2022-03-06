import { AnyAction } from 'redux';
import { combineEpics, Epic, StateObservable } from 'redux-observable';
import { Observable, ReplaySubject } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import * as navigationEpic from './navigationEpic';
import routerEpic from './routerEpic';

const epic$ = new ReplaySubject<Epic>(Infinity, 15000)

epic$.next(combineEpics(...[routerEpic, ...Object.values(navigationEpic)]))

export const rootEpic = (
  action$: Observable<AnyAction>,
  state$: StateObservable<any>
) =>
  epic$.pipe(
    mergeMap(epic => {
      return epic(action$, state$, null)
    })
  )

export const registerEpics = (...epics: Epic[]) => {
  epics.forEach(epic => epic$.next(epic))
}

export default rootEpic
