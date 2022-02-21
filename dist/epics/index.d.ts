import { Observable } from 'rxjs';
import { Epic, StateObservable } from 'redux-observable';
import { Action } from 'types';
export declare const rootEpic: (action$: Observable<Action>, state$: StateObservable<any>) => Observable<any>;
export declare const registerEpics: (...epics: Epic[]) => void;
export default rootEpic;
//# sourceMappingURL=index.d.ts.map