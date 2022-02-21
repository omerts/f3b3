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
export var createAction = function (type, payload) {
    if (!type) {
        throw new Error('An action must have a type');
    }
    // This destructuring is a combina for conditionaly adding the payload key
    // we could add it on a different line, but we would like to keep payload as
    // a readonly prop
    return __assign({ type: type }, (payload && { payload: payload }));
};
export default createAction;
