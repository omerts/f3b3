import { Draft } from 'immer'
// @ts-ignore
import safeGet from 'lodash/get'
// @ts-ignore
import keys from 'lodash/keys'
// @ts-ignore
import pick from 'lodash/pick'
import { Action } from 'types'

export function getAutoMapper<StateType> (path?: string | string[]) {
  return (state: Draft<StateType>, action: Action) => {
    const { payload } = action
    const stateKeys = keys(state)

    let relevantObject = payload

    if (path) {
      relevantObject = safeGet(payload, path, payload)
    }

    relevantObject = pick(relevantObject, stateKeys)

    Object.keys(relevantObject).forEach(key => {
      ;(state as StateType)[key as keyof StateType] = relevantObject[key]
    })
  }
}

export function getMapper<StateType, PayloadType> (
  stateKeys: string[],
  payloadKeys: (keyof PayloadType)[]
) {
  if (
    !stateKeys?.length ||
    !payloadKeys?.length ||
    stateKeys?.length !== payloadKeys?.length
  ) {
    throw new Error(
      'getMapper must receive both stateKeys and payloadKeys, and they must be of the same length'
    )
  }

  return (state: Draft<StateType>, action: Action) => {
    const { payload } = action

    stateKeys.forEach((key, index) => {
      ;(state as StateType)[key as keyof StateType] = safeGet(
        payload,
        payloadKeys[index]
      )
    })
  }
}
