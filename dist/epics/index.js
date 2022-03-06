import { combineEpics } from 'redux-observable';
import { ReplaySubject } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import routerEpic from './routerEpic';
var epic$ = new ReplaySubject(Infinity, 15000);
epic$.next(combineEpics.apply(void 0, [routerEpic]));
export var rootEpic = function (action$, state$) {
    return epic$.pipe(mergeMap(function (epic) {
        return epic(action$, state$, null);
    }));
};
export var registerEpics = function () {
    var epics = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        epics[_i] = arguments[_i];
    }
    epics.forEach(function (epic) { return epic$.next(epic); });
};
export default rootEpic;
