import { ofType } from 'redux-observable';
import { interval, of } from 'rxjs';
import { catchError, filter, mapTo, pluck, startWith, switchMap, takeUntil } from 'rxjs/operators';
import Actions from '../actions';
export var getPayload = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return function (src) {
        return src.pipe(ofType.apply(void 0, args), pluck('payload'));
    };
};
export var startPolling = function (timeInSeconds, takeUntilParam) {
    return function (src) {
        return src.pipe(switchMap(function (payload) {
            return interval(timeInSeconds * 1000).pipe(takeUntil(takeUntilParam), mapTo(payload), startWith(payload));
        }));
    };
};
export var ofRoute = function () {
    var routes = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        routes[_i] = arguments[_i];
    }
    return function (src) {
        return src.pipe(getPayload(Actions.ROUTE_CHANGED), filter(function (location) {
            return routes === null || routes === void 0 ? void 0 : routes.includes(location.path);
        }));
    };
};
export var catchAndDispatchError = catchError(function (error) {
    console.error(error);
    return of(Actions.createAction(Actions.OPERATION_FAILED, { error: error }));
});
export var catchAndDispatchCustomError = function (error) {
    return catchError(function () {
        console.error(error);
        return of(Actions.createAction(Actions.OPERATION_FAILED, { error: error }));
    });
};
