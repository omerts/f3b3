export interface EmptyAction {
    type: string;
}
export interface Action<T = any> extends EmptyAction {
    payload: T;
}
export declare type AnyAction = EmptyAction | Action;
//# sourceMappingURL=Actions.d.ts.map