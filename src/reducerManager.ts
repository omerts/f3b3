import { Reducer } from 'react';
import { AnyAction, combineReducers, ReducersMapObject } from 'redux';

export function createReducerManager () {
  let combinedReducer: Reducer<any, AnyAction> | null = null

  // Create an object which maps keys to reducers
  const reducers: ReducersMapObject = {}

  // An array which is used to delete state keys when reducers are removed
  let keysToRemove: string[] = []

  return {
    getReducerMap: () => reducers,
    // The root reducer function exposed by this object
    // This will be passed to the store
    reduce: (state: any, action: AnyAction) => {
      // If any reducers have been removed, clean up their state first
      if (keysToRemove.length > 0) {
        state = { ...state }

        for (let key of keysToRemove) {
          delete state[key]
        }

        keysToRemove = []
      }

      // Delegate to the combined reducer
      return combinedReducer?.(state, action)
    },
    // Adds a new reducer with the specified key
    add: (key: string, reducer: Reducer<any, any>) => {
      if (!key || reducers[key]) {
        return
      }

      // Add the reducer to the reducer mapping
      reducers[key] = reducer

      // Generate a new combined reducer
      combinedReducer = combineReducers(reducers)
    },
    // Removes a reducer with the specified key
    remove: (key: string) => {
      if (!key || !reducers[key]) {
        return
      }

      // Remove it from the reducer mapping
      delete reducers[key]

      // Add the key to the list of keys to clean up
      keysToRemove.push(key)

      // Generate a new combined reducer
      combinedReducer = combineReducers(reducers)
    }
  }
}

export default createReducerManager()
