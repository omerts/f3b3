var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { ReplaySubject } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { combineEpics } from 'redux-observable';
import routerEpic from './routerEpic';
import * as browserHistoryEpic from './browserHistoryEpic';
var epic$ = new ReplaySubject(Infinity, 15000);
epic$.next(combineEpics.apply(void 0, __spreadArray([routerEpic], Object.values(browserHistoryEpic), true)));
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
