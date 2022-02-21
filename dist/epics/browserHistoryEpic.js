var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { fromEventPattern } from 'rxjs';
import { startWith, tap, map, filter, withLatestFrom } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import history from '../utils/getHistory';
import Actions from '../actions';
export var routeChanged = function () {
    return fromEventPattern(history.listen, function (_, unlisten) { return unlisten(); }).pipe(
    // TODO fix TS type
    map(function (_a) {
        var location = _a.location;
        return location;
    }), startWith(history.location), map(function (location) {
        return Actions.createAction(Actions.ROUTE_CHANGED, __assign(__assign({}, location), { path: location.pathname }));
    }));
};
export var routeQueryUpdated = function (action$) {
    var lastRoute = action$.pipe(ofType(Actions.ROUTE_CHANGED));
    return action$.pipe(ofType(Actions.ROUTE_UPDATED), withLatestFrom(lastRoute), map(function (_a) {
        var current = _a[0], last = _a[1];
        return Object.assign({}, last, current);
    }), tap(function (_a) {
        var payload = _a.payload;
        if (payload.action === 'replace') {
            history.replace(payload.path || payload.pathname, payload.state);
        }
        else {
            history.push(payload.path || payload.pathname, payload.state);
        }
    }), filter(function () { return false; }));
};
export var navigateTo = function (action$) {
    return action$.pipe(ofType(Actions.NAVIGATED_TO), tap(function (_a) {
        var payload = _a.payload;
        if (typeof payload === 'string') {
            history.push(payload);
        }
        else {
            history.push(payload.path || payload.pathname, payload.state);
        }
    }), filter(function () { return false; }));
};
export var navigateBack = function (action$) {
    return action$.pipe(ofType(Actions.NAVIGATED_BACK), tap(function () { return history.back(); }), filter(function () { return false; }));
};
