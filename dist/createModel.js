import produce from 'immer';
import { isMatch } from './utils/routing';
import { registerRoute } from './epics/routerEpic';
import reducerManager from './reducerManager';
import { registerEpics } from './epics';
var buildReducersThunk = function (params) {
    return produce(function (draft, action) {
        // If we are not on the configured route, do nothing
        // Using window.location is a hack until history fix there bug, i opened an issue here:
        // https://github.com/remix-run/history/issues/895
        if (params.route && !isMatch(params.route, window.location.pathname)) {
            return;
        }
        if (params.reducers) {
            Object.entries(params.reducers).forEach(function (_a) {
                var key = _a[0], value = _a[1];
                if (action.type === key) {
                    value(draft, action);
                }
            });
        }
    }, params.initialState);
};
export var createModel = function (params) {
    var _a, _b;
    (_a = params.initActions) === null || _a === void 0 ? void 0 : _a.forEach(function (initAction) {
        return registerRoute(initAction);
    });
    if ((_b = params.epics) === null || _b === void 0 ? void 0 : _b.length) {
        registerEpics.apply(void 0, params.epics);
    }
    // Todo add support for removing reducer according to route
    return reducerManager.add(params.key, buildReducersThunk(params));
};
export default createModel;
