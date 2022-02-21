import { Observable } from 'rxjs';
import { Action, Route } from '../types';
export declare const getPayload: (args_0: string) => (src: Observable<Action>) => Observable<any>;
export declare const startPolling: (timeInSeconds: number, takeUntilParam: Observable<Action>) => (src: Observable<Action>) => Observable<Action<any>>;
export declare const ofRoute: (...routes: string[]) => (src: Observable<Action>) => Observable<Route>;
export declare const catchAndDispatchError: import("rxjs").OperatorFunction<unknown, unknown>;
export declare const catchAndDispatchCustomError: (error: Error) => import("rxjs").OperatorFunction<unknown, unknown>;
//# sourceMappingURL=rxUtils.d.ts.map