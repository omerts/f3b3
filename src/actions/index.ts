import * as createAction from './createAction'
import * as errorActions from './errorActions'
import * as routeActions from './routeActions'

export const Actions = {
  ...createAction,
  ...errorActions,
  ...routeActions
}

export default Actions
