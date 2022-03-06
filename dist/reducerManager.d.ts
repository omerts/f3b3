import { Reducer } from 'react';
import { AnyAction, ReducersMapObject } from 'redux';
export declare function createReducerManager(): {
    getReducerMap: () => ReducersMapObject<any, import("redux").Action<any>>;
    reduce: (state: any, action: AnyAction) => any;
    add: (key: string, reducer: Reducer<any, any>) => void;
    remove: (key: string) => void;
};
declare const _default: {
    getReducerMap: () => ReducersMapObject<any, import("redux").Action<any>>;
    reduce: (state: any, action: AnyAction) => any;
    add: (key: string, reducer: Reducer<any, any>) => void;
    remove: (key: string) => void;
};
export default _default;
//# sourceMappingURL=reducerManager.d.ts.map