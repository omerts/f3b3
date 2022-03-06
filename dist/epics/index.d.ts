import { AnyAction } from 'redux';
import { Epic, StateObservable } from 'redux-observable';
import { Observable } from 'rxjs';
export declare const rootEpic: (action$: Observable<AnyAction>, state$: StateObservable<any>) => Observable<any>;
export declare const registerEpics: (...epics: Epic[]) => void;
export default rootEpic;
//# sourceMappingURL=index.d.ts.map