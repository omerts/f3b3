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
import * as createAction from './createAction';
import * as errorActions from './errorActions';
import * as routeActions from './routeActions';
export var Actions = __assign(__assign(__assign({}, createAction), errorActions), routeActions);
export default Actions;
