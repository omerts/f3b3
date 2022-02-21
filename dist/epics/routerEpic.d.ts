import { Epic } from 'redux-observable';
import { AnyAction, Route } from '../types';
export interface RouteCallbackParam {
    route: Route;
    pathParams: Object;
}
export interface RegisterRouteParams {
    path: string;
    callback: (params: RouteCallbackParam) => AnyAction | AnyAction[];
    notPath?: string;
    exactMatch?: boolean;
    oneTimeOnly?: boolean;
    resetOneTimeRoute?: string;
}
export declare const registerRoute: (registerParams: RegisterRouteParams) => void;
export declare const route: Epic;
export default route;
//# sourceMappingURL=routerEpic.d.ts.map