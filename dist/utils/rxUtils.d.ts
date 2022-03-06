import { AnyAction } from 'redux';
import { Observable } from 'rxjs';
import { Route } from '../types';
export declare const getPayload: (args_0: string) => (src: Observable<AnyAction>) => Observable<any>;
export declare const startPolling: (timeInSeconds: number, takeUntilParam: Observable<AnyAction>) => (src: Observable<AnyAction>) => Observable<AnyAction>;
export declare const ofRoute: (...routes: string[]) => (src: Observable<AnyAction>) => Observable<Route>;
export declare const catchAndDispatchError: import("rxjs").OperatorFunction<unknown, unknown>;
export declare const catchAndDispatchCustomError: (error: Error) => import("rxjs").OperatorFunction<unknown, unknown>;
//# sourceMappingURL=rxUtils.d.ts.map