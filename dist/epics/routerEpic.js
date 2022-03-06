import { from } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import Actions from '../actions';
import { isMatch } from '../utils/routing';
import { catchAndDispatchError, getPayload } from '../utils/rxUtils';
// TODO find a more functional approach
var routeConfig = [];
export var registerRoute = function (registerParams) {
    routeConfig.push(registerParams);
};
// ==================== No need to touch below this line ==================================================
var runRouteAction = function (route) {
    return routeConfig.reduce(function (actions, registerParams) {
        if (registerParams.oneTimeOnly &&
            registerParams._didRun &&
            registerParams.resetOneTimeRoute) {
            if (isMatch(registerParams.resetOneTimeRoute, route.path)) {
                registerParams._didRun = false;
                // After reset don't run the check for current route
                return actions;
            }
        }
        if (registerParams.notPath) {
            var matched_1 = isMatch(registerParams.notPath, route.path);
            if (matched_1) {
                return actions;
            }
        }
        if (registerParams.oneTimeOnly && registerParams._didRun) {
            return actions;
        }
        var matched = isMatch(registerParams.path, route.path, registerParams.exactMatch);
        if (matched) {
            // Query contains search parameters, aka ?a=1&b=2, matched contains parameters from the
            // route, aka /cases/zoom/:targetId.
            var result = registerParams.callback({
                route: route,
                pathParams: matched
            });
            if (registerParams.oneTimeOnly) {
                registerParams._didRun = true;
            }
            if (result) {
                return actions.concat(result);
            }
        }
        return actions;
    }, []);
};
export var route = function (action$) {
    return action$.pipe(getPayload(Actions.ROUTE_CHANGED), filter(function (payload) { return !payload.state || !payload.state.skipRouterService; }), map(function (payload) { return runRouteAction(payload); }), filter(function (result) { return !!result; }), switchMap(function (result) {
        return from(result).pipe(catchAndDispatchError);
    }));
};
export default route;
