# Please note this is an alpha version

[![npm version](https://badge.fury.io/js/f3b3.svg)](https://badge.fury.io/js/f3b3)
[![code style: prettier-standard](https://img.shields.io/badge/code_style-standard-ff69b4.svg?style=flat-square)](https://standardjs.com/)
[![TypeScript](https://badges.frapsoft.com/typescript/code/typescript.svg?v=101)](https://github.com/ellerbrock/typescript-badges/)

# Project Name

f3b3 is light-weight infrastructure for developing React, Redux, and RX based applications, with built in routing, and fetch on route. It also promotes breaking down your frontend into micro-frontends.

## Prerequisites

Before using this lib you should be familiar with [react-redux](https://react-redux.js.org/) & [redux-observable](https://redux-observable.js.org/).

This project has the following peer dependencies:

1. react - 16.8.0 and up
2. react-dom - 17.0.2 and up
3. react-redux - 7.1.0 and up
4. redux: 4.1.1 and up
5. rxjs: 6 and up

## Table of contents

- [Please note this is an alpha version](#please-note-this-is-an-alpha-version)
- [Project Name](#project-name)
  - [Prerequisites](#prerequisites)
  - [Table of contents](#table-of-contents)
  - [Installation](#installation)
  - [Setup](#setup)
  - [Usage](#usage)
    - [createModel](#createmodel)
      - [Params](#params)
      - [RegisterRouteParams](#registerrouteparams)
    - [Actions](#actions)
      - [Built in actions](#built-in-actions)
    - [Actions.createAction](#actionscreateaction)
    - [Built-in actions](#built-in-actions-1)
    - [redux-observable helpers](#redux-observable-helpers)
  - [React Hooks](#react-hooks)
    - [useCreateAction](#usecreateaction)
    - [useNavigate](#usenavigate)
  - [General recommnedations](#general-recommnedations)
  - [More information](#more-information)
  - [Credits](#credits)
  - [Built With](#built-with)
  - [Versioning](#versioning)
  - [Authors](#authors)
  - [License](#license)
  - [If I see people will start using this lib, I will create a full working example project.](#if-i-see-people-will-start-using-this-lib-i-will-create-a-full-working-example-project)

## Installation

**BEFORE YOU INSTALL:** please read the [prerequisites](#prerequisites)

To install run:

```
// npm
npm install f3b3

// yarn
yarn install f3b3

```

## Setup

1 . To hook f3b3 into redux, you will need to configure your redux store, with `reduce`, `rootEpic`, and `createEpicMiddleware` from `f3b3` (not to be confused to redux-observable)

```typescript
import { reduce, rootEpic, createEpicMiddleware } from 'f3b3'
import { createStore, applyMiddleware, compose } from 'redux'

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose
  }
}

const composeEnhancers =
  window?.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__?.() || compose
const epicMiddleware = createEpicMiddleware()
const store = createStore(
  reduce,
  composeEnhancers(applyMiddleware(epicMiddleware))
)

epicMiddleware.run(rootEpic)

export default store
```

2. You will need to import your models in your index file. A common pattern is to create a bootstrapper file, and import that file in your index file.

```typescript
// bootstrapper.ts
export * from './features/common/models'
export * from './features/top-bar/models'
export * from './features/settings/models'
export * from './features/help/models'
```

```typescript
// index.ts
import App from './App'
import './bootstrapper'
import store from './store'

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
```

## Usage

### createModel

Inspired by slices from Redux-Toolkit, a model is where all the behind the scenes logic resides. It brings together, the state, initialization actions, and redux-observable's epics. State is managed using [immer](https://github.com/immerjs/immer). So you can mutate all you want.

No doc is as good as code :), here are the typescripts types and signature.

```typescript
export interface CreateModelParams<T> {
  key: string
  initialState: T,
  route?: string
  initActions?: RegisterRouteParams[]
  epics?: Epic[]
  reducers?: ModelReducers<T>
}

export interface ModelReducers<T> {
  [actionType: string]: (state: Draft<T>, action: Action<any>) => void
}

export interface RegisterRouteParams {
  path: string
  callback: (params: RouteCallbackParam) => AnyAction | AnyAction[]
  notPath?: string
  exactMatch?: boolean
  oneTimeOnly?: boolean
  resetOneTimeRoute?: string
}

export interface RouteCallbackParam {
  route: Route
  pathParams: Object
}

export const createModel = <T>(params: CreateModelParams<T>)
```

#### Params

`T (Typescript only)`

| Type | Required                  | Description                    |
| ---- | ------------------------- | ------------------------------ |
| Type | Yes (if using typescript) | The type of the model's state. |

`key`

| Type   | Required | Description                                                                                         |
| ------ | -------- | --------------------------------------------------------------------------------------------------- |
| string | Yes      | A distinict key for the model. This will also become the model's state key in the app state object. |

`initialState`

| Type   | Required | Description                                                                   |
| ------ | -------- | ----------------------------------------------------------------------------- |
| Object | Yes      | An instance of the state type with default values for non optional properties |

`route`

| Type   | Required | Description                                                                                    |
| ------ | -------- | ---------------------------------------------------------------------------------------------- |
| string | No       | If defined, this will limit updates, and init actions (see below), only for the defined route. |

`initActions`

| Type  | Required | Description                                                                                                                                      |
| ----- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Array | No       | An array definning what actions should be dispatched and when, based on the current route. See `RegisterRouteParams` below for more information. |

`epics`

| Type  | Required | Description                                                                                                                                              |
| ----- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Array | No       | An array of epics you have created to control side-effects of this model. See [redux-observable](https://redux-observable.js.org/) for more information. |

`reducers`

| Type   | Required | Description                                                       |
| ------ | -------- | ----------------------------------------------------------------- |
| Object | No       | An object defining a map between an action type, and its reducer. |

Example:

```typescript
import { createModel, ModelReducers, Action, Draft, Actions } from 'f3b3'

import * as helpActions from '../actions'
import * as helpEpic from '../epics/helpEpic'
import {
  HelpDataReceivedPayload,
  HelpElement,
  HelpElementChangedPayload
} from '../types'

export interface HelpModelState {
  isActive: boolean
  helpData: HelpElement[]
  activeElement: HelpElement | null
}

const initActions = [
  {
    path: '/*',
    callback: () => {
      return [Actions.createAction(helpActions.HELP_DATA_REQUESTED)]
    },
    oneTimeOnly: true,
    resetOneTimeRoute: '/login'
  }
]

const handleHelpToggled = (state: Draft<HelpModelState>) => {
  state.isActive = !state.isActive

  if (!state.isActive) {
    state.activeElement = null
  }
}

const handleHelpDataReceived = (
  state: Draft<HelpModelState>,
  action: Action<HelpDataReceivedPayload>
) => {
  state.helpData = action.payload.elements
}

const helpElementChanged = (
  state: Draft<HelpModelState>,
  action: Action<HelpElementChangedPayload>
) => {
  state.activeElement = action.payload.element
}

const reducers: ModelReducers<HelpModelState> = {
  [helpActions.HELP_TOGGLED]: handleHelpToggled,
  [helpActions.HELP_DATA_RECEIVED]: handleHelpDataReceived,
  [helpActions.HELP_ELEMENT_CHANGED]: helpElementChanged
}

createModel<HelpModelState>({
  key: 'help',
  reducers,
  epics: Object.values(helpEpic),
  initActions,
  initialState: {
    isActive: false,
    helpData: [],
    activeElement: null
  }
})
```

#### RegisterRouteParams

`createModels`'s `initActions` is defined as an array of `RegisterRouteParams`. On every route change, f3b3 will try to match the registered actions, and dispatch the ones that match the route.

`path`

| Type   | Required | Description                                                                                |
| ------ | -------- | ------------------------------------------------------------------------------------------ |
| string | Yes      | The URL path to match against in order to decide whether this action should be dispatched. |

`callback`

| Type     | Required | Description                                                                                                                                                   |
| -------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| function | Yes      | The callback that will be invoked with the route and any params defined in the path. An action or array of actions to dispatch is expected as a return value. |

`notPath`

| Type   | Required | Description                                                            |
| ------ | -------- | ---------------------------------------------------------------------- |
| string | No       | A path that only when it is not matched, the callback will be invoked. |

`exactMatch`

| Type    | Required               | Description                                                                                                                |
| ------- | ---------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| boolean | No (defaults to false) | Whether the path matching should be exact, or also match child paths. Default to false, where all subsets of a path match. |

`oneTimeOnly`

| Type    | Required               | Description                                                                                                                                            |
| ------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| boolean | No (defaults to false) | Whether this should be matched only one time. Good for loading server configurations, user settings, and similar data that should only be loaded once. |

`resetOneTimeRoute`

| Type   | Required | Description                                                                                                                                                                                                                                                                                                                                                |
| ------ | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| string | No       | An escape hatch that will reset the flag in case oneTimeOnly is defined to true. This is useful when you need to reload the user settings on login for example. So, you can set `oneTimeOnly` to true, in order to avoid redundant user setttings fetching, and then set `resetOneTimeRoute` to `/login` to make sure the data is loaded on the next login |

Example:

```typescript
const initActions = [
  {
    path: '/*',
    notPath: '/login',
    callback: () => {
      return [Actions.createAction(CommonActions.USER_SETTINGS_REQUESTED)]
    },
    oneTimeOnly: true,
    resetOneTimeRoute: '/login'
  }
]
```

### Actions

f3b3 comes with some built in actions, and a generic action creator to avoid the boilerplate of creating action creators for every action.

#### Built in actions

### Actions.createAction

| Params                                        | Description                                                                      |
| --------------------------------------------- | -------------------------------------------------------------------------------- |
| arg 1: Action type, arg 2 (optional): payload | Helper function to easily create a Redux action without a custom action creator. |

Example:

```typescript
import { Actions } from 'f3b3'

Actions.createAction<UserNotifiedPayload>(CommonActions.USER_NOTIFIED, {
  notification: {
    severity: 'error',
    life: 3000,
    closable: true,
    summary: error.message,
    actionType: NotificationActionType.error
  }
})
```

### Built-in actions

`ROUTE_CHANGED`

| Description                                                                                   |
| --------------------------------------------------------------------------------------------- |
| Dispatched whenever the route changes. Allows to respond to route changes in state and epics. |

```
Payload (taken from https://v5.reactrouter.com/web/api/history):
pathname - (string) The path of the URL
path - pathname alias
search - (string) The URL query string
hash - (string) The URL hash fragment
state - (object) location-specific state that was provided to e.g. push(path, state) when this location was pushed onto the stack. Only available in browser and memory history.
```

`NAVIGATED_TO`

| Description                                                                                                                                                                            |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Used as a unified navigation action both from epics and components. Used to move to another route. Dispatching this action will initialize a navigation, and run relevant initActions. |

Payload:
string of path to navigate to

Example:

```typescript
Actions.createAction(Actions.NAVIGATED_TO, '/login'),
```

`NAVIGATED_BACK`

| Description                 |
| --------------------------- |
| Create a "back" navigation. |

Payload:
N/A

Example:

```typescript
Actions.createAction(Actions.NAVIGATED_BACK)
```

`ROUTE_UPDATED`

| Description                                   |
| --------------------------------------------- |
| Allows for a partial update of current route. |

Payload:

All fields are optional.

```
pathname - (string) The path of the URL
path - pathname alias
search - (string) The URL query string
hash - (string) The URL hash fragment
state - (object) location-specific state that was provided to e.g. push(path, state) when this location was pushed onto the stack. Only available in browser and memory history.
action - whether to replace the current route in the stack or to push a new route, defaults to push. Pass "replace" in order to replace current route on stack.
```

Example:

```typescript
Actions.createAction(Actions.ROUTE_UPDATED, { search: '?test=1' })
```

`OPERATION_FAILED`

| Description                                                                                                                               |
| ----------------------------------------------------------------------------------------------------------------------------------------- |
| Used to notify subscribers about a failure in system. Most commonly used by epics when a side-effect, such as a server data fetch, fails. |

### redux-observable helpers

`getPayload`

| Params                                    | Description                                                                                                                                                 |
| ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| List of action types separated by a comma | Instead of using redux-observable ofType, and having to pluck the payload, you can just use getPayload instead it will filter by type and pluck the payload |

Example:

```typescript
import { getPayload } from 'f3b3'

export const errorNotifier = (action$: Observable<Action>) => {
  return action$.pipe(
    getPayload(Actions.OPERATION_FAILED),
    map(({ error }) => {
      return Actions.createAction<UserNotifiedPayload>(
        CommonActions.USER_NOTIFIED,
        {
          notification: {
            severity: 'error',
            life: 3000,
            closable: true,
            summary: error.message,
            actionType: NotificationActionType.error
          }
        }
      )
    })
  )
}
```

`ofRoute`

| Params                              | Description                                                                                            |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------ |
| List of routes separated by a comma | Helper to easily filter by a specific route/s, in order to dispatch actions based on a certain route/s |

Example:

```typescript
import { ofRoute } from 'f3b3'

export const redirectFromInactiveRoute = (action$: Observable<Action>) => {
  return action$.pipe(
    ofRoute('/not-a-real-path'),
    mapTo(Actions.createAction(Actions.NAVIGATED_TO, '/login'))
  )
}
```

`startPolling`

| Params                                                                         | Description                                                                                                                                                                                                                                                             |
| ------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| arg 1: polling in seconds, arg 2: Observable to takeUntil (see Rx's TakeUntil) | Use this helper method in case you need to dispatch an action on set intervals. Seconds parameter is an observable, that once emits a value, the interval will stop. This can be helpful in case you need to poll a server (if no websocket is available) for new data. |

Example:

```typescript
import { getPayload, startPolling } from 'f3b3'

export const checkForNewMessages = (action$: Observable<Action>) => {
  return action$.pipe(
    getPayload(Actions.LOGIN_RECEIVED),
    startPolling(30, action$.pipe(getPayload(Actions.LOGOUT_RECEIVED))),
    mapTo(Actions.createAction(Actions.INBOX_MESSAGED_REQUESTED))
  )
}
```

`catchAndDispatchError`

| Params | Description                                                                                                                                                                          |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| N/A    | Helper operator for catching errors, and dispatching the built in `OPERATION_FAILED` action. Error will be also logged to console. Useful for handling errors in data loading epics. |

Example:

```typescript
import { getPayload, catchAndDispatchError } from 'f3b3'

export const changePassword = (
  action$: Observable<Action>,
  state$: StateObservable<AppState>
) => {
  return action$.pipe(
    getPayload(AuthActions.CHANGE_PASSWORD_REQUESTED),
    withLatestFrom(state$),
    mergeMap(([payload, state]) => {
      return postFormData('/reset_password', {
        ...payload,
        username: state.common.user?.name
      }).pipe(
        mapTo(Actions.createAction(AuthActions.CHANGE_PASSWORD_RECEIVED)),
        // Catch inside mergeMap to keep outer observable alive in case of exceptions
        catchAndDispatchError
      )
    })
  )
}
```

`catchAndDispatchCustomError`

| Params                | Description                                                                                                                                                                |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| The error to dispatch | Similar to `catchAndDispatchError` just allows for dispatching a custom error instead of the actual error caught. Error will still be under the `OPERATION_FAILED` action. |

Example:

```typescript
import { getPayload, catchAndDispatchError } from 'f3b3'

export const changePassword = (
  action$: Observable<Action>,
  state$: StateObservable<AppState>
) => {
  return action$.pipe(
    getPayload(AuthActions.CHANGE_PASSWORD_REQUESTED),
    withLatestFrom(state$),
    mergeMap(([payload, state]) => {
      return postFormData('/reset_password', {
        ...payload,
        username: state.common.user?.name
      }).pipe(
        mapTo(Actions.createAction(AuthActions.CHANGE_PASSWORD_RECEIVED)),
        catchAndDispatchCustomError(new Error('Server disconnected'))
      )
    })
  )
}
```

## React Hooks

### useCreateAction

| Params                                        | Description                                                     |
| --------------------------------------------- | --------------------------------------------------------------- |
| arg 1: Action type, arg 2 (optional): payload | A React hook to easily dispatch actions from within components. |

```typescript
import { useCreateAction } from 'f3b3'

const App = (): JSX.Element => {
  const createAction = useCreateAction()

  const sidebarActionList: SidebarActionElement[] = [
    {
      icon: 'help-ic',
      action: () => createAction(HelpActions.HELP_TOGGLED),
      active: isHelpActive
    }
  ]
  // ...
}
```

### useNavigate

| Params                                                     | Description                                                       |
| ---------------------------------------------------------- | ----------------------------------------------------------------- |
| string of path or Route type see (`ROUTE_CHANGED` payload) | A React hook to easily perform navgiation from within components. |

```tsx
import { useNavigate, useSelector } from 'f3b3'
import { AnchorHTMLAttributes, FC } from 'react'
import { AppState } from 'types'
import matchPath from 'utils/matchPath'

export interface NavLinkProps extends AnchorHTMLAttributes<unknown> {
  to: string
  exactMatch?: boolean
}

export const NavLink: FC<NavLinkProps> = props => {
  const navigate = useNavigate()
  const route = useSelector((state: AppState) => state.common.route)

  const { to, exactMatch, ...other } = props

  const activeClassname = matchPath(to, route?.path, exactMatch)
    ? ' active'
    : ''

  return (
    <a
      {...other}
      className={`${props.className || ''}${activeClassname}`}
      onClick={() => navigate(to)}
    />
  )
}

export default NavLink
```

## General recommnedations

1. Name your actions as something that already happened in the system, and inside your state and epics you are "reacting" to them.
2. Break down your frontend into features, having at least one model (using `createModel`) per feature.
3. Create a common model to hold common actions, state, and models.
4. It is ok to reference actions and state from another model, just make sure it makes sense.

##

## More information

In order to ease imports, we have re-exported all of react-redux, and main redux-observable exports, so you can just import them all from f3b3.
Example:

```typescript
import { useNavigate, useSelector, createEpicMiddleware } from 'f3b3'
```

## Credits

Big thanks to the one and only G-d.

Credits to the following great libs and their authors:

- [React](https://github.com/facebook/react)
- [Redux](https://github.com/reduxjs/redux)
- [React-Redux](https://github.com/reduxjs/react-redux)
- [Redux-Observable](https://github.com/redux-observable/redux-observable/)
- [History](https://github.com/remix-run/history)
- [Immer](https://github.com/immerjs/immer)

## Built With

- Typescript

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags).

## Authors

- **Omer Spalter** - [omerts](https://github.com/omerts)

## License

[MIT License](https://andreasonny.mit-license.org/2022) © Omer Spalter

## If I see people will start using this lib, I will create a full working example project.
