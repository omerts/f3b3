import { Epic } from 'redux-observable';
export declare const routeChanged: () => import("rxjs").Observable<{
    payload?: {
        path: string;
        state: unknown;
        key: string;
        pathname: string;
        search: string;
        hash: string;
    } | undefined;
    type: string;
}>;
export declare const routeQueryUpdated: Epic;
export declare const navigateTo: Epic;
export declare const navigateBack: Epic;
//# sourceMappingURL=browserHistoryEpic.d.ts.map