import * as storageKeys from '../consts/storageKeys';
var getStorage = function (isSession) {
    if (isSession) {
        return typeof sessionStorage !== 'undefined' && sessionStorage;
    }
    return typeof localStorage !== 'undefined' && localStorage;
};
export var save = function (key, data, isSession) {
    if (isSession === void 0) { isSession = false; }
    var storage = getStorage(isSession);
    if (storage) {
        storage.setItem(key, data);
    }
};
export var load = function (key, isSession) {
    if (isSession === void 0) { isSession = false; }
    var storage = getStorage(isSession);
    if (storage) {
        return typeof storage !== 'undefined' && storage.getItem(key);
    }
};
export var remove = function (key, isSession) {
    if (isSession === void 0) { isSession = false; }
    var storage = getStorage(isSession);
    if (storage) {
        // this timeout is here to prevent loguot after page refresh for some reason
        storage.removeItem(key);
    }
};
export var clearUserData = function () {
    Object.keys(storageKeys).forEach(function (key) { return remove(key); });
};
export default { save: save, load: load, remove: remove, clearUserData: clearUserData };
