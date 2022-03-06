import { Epic, ofType } from 'redux-observable';
import { asyncScheduler } from 'rxjs';
import { map, observeOn, pluck, tap, withLatestFrom } from 'rxjs/operators';

import { NavigationContainerRef } from '@react-navigation/native';

import Actions from '../actions';
import { getPayload } from '../utils';

const getNavigator = pluck<NavigationContainerRef<any>>('navigator')

const dispatchNavigatedAction = map(([{ payload }]) =>
  Actions.createAction(Actions.ROUTE_CHANGED, payload)
)

export type NavigationPayload = {
  payload: string | { main: string; params: any }
}

export const navigateTo: Epic = action$ => {
  const navigator = action$.pipe(
    getPayload(Actions.NAVIGATION_REGISTERED),
    getNavigator
  )

  return action$.pipe(
    ofType(Actions.NAVIGATED_TO),
    withLatestFrom(navigator),
    // Put on micro visit queue, so we let the appnavigator update b4 changing route
    // @ts-ignore TODO Fix this
    observeOn(asyncScheduler),
    tap(
      ([{ payload }, navigator]: [
        NavigationPayload,
        NavigationContainerRef<any>
      ]) => {
        // Check if it is a simple navigation or navigation with deep links
        // which comes as an object
        if (typeof payload === 'string') {
          navigator.navigate(payload)
        } else if (typeof payload === 'object' && payload.main) {
          const { main, params } = payload

          navigator.navigate(main, params)
        }
      }
    ),
    dispatchNavigatedAction
  )
}

export const navigateBack: Epic = action$ => {
  const navigator = action$.pipe(
    getPayload(Actions.NAVIGATION_REGISTERED),
    getNavigator
  )

  return action$.pipe(
    ofType(Actions.NAVIGATED_BACK),
    // @ts-ignore TODO Fix this
    withLatestFrom(navigator),
    tap(([, navigator]: [unknown, NavigationContainerRef<any>]) =>
      navigator.goBack()
    ),
    map(([, navigator]: [unknown, NavigationContainerRef<any>]) => {
      return [{ payload: navigator.getCurrentRoute()?.name }]
    }),
    dispatchNavigatedAction
  )
}
