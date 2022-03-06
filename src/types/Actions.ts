export interface EmptyAction {
  type: string
}

export interface Action<T = any> extends EmptyAction {
  payload: T
}

export type AnyAction = EmptyAction | Action
