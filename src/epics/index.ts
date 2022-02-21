import { ReplaySubject, Observable } from 'rxjs'
import { mergeMap } from 'rxjs/operators'
import { combineEpics, Epic, StateObservable } from 'redux-observable'
import { Action } from 'types'
import routerEpic from './routerEpic'
import * as browserHistoryEpic from './browserHistoryEpic'

const epic$ = new ReplaySubject<Epic>(Infinity, 15000)

epic$.next(combineEpics(...[routerEpic, ...Object.values(browserHistoryEpic)]))

export const rootEpic = (
  action$: Observable<Action>,
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
