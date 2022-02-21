//@ts-nocheck
import routeParser from 'route-parser';
import urlParser from 'url-parse';
import isEqual from 'lodash/isEqual';
import isObjectMatch from 'lodash/isMatch';
import trimEnd from './trimEnd';
function formatRoute(route, exactMatch) {
    var suffix = exactMatch ? '' : '(/*childRoutes)';
    // Check if optional path, add inside the optional so doesn't match all paths
    if (route.endsWith(')')) {
        return route.slice(0, -1) + suffix + ')';
    }
    return route + suffix;
}
// TODO deprecate exactMatch, and just let developers send * in the path
export function isMatch(haystack, needle, exactMatch) {
    if (exactMatch === void 0) { exactMatch = false; }
    var haystackClone = haystack;
    // Fix the routes prefix if needed
    if (haystackClone.indexOf('/') !== 0) {
        haystackClone = '/' + haystackClone;
    }
    // /test is not a match with /test/, see https://github.com/rcs/route-parser/issues/24
    // so remove trailing slash
    var fixedNeedle = needle;
    // Check if length is greater than 1, since we only want to trim end slash, if it is not the only slash
    if (fixedNeedle.length > 1) {
        fixedNeedle = trimEnd(fixedNeedle, '/');
    }
    return routeParser(formatRoute(haystackClone, exactMatch)).match(fixedNeedle);
}
export function getMatchedQuery(routes, route, exactQueryMatch) {
    if (routes === void 0) { routes = []; }
    if (exactQueryMatch === void 0) { exactQueryMatch = false; }
    var path = route === null || route === void 0 ? void 0 : route.path;
    var query = route === null || route === void 0 ? void 0 : route.query;
    return routes.find(function (r) {
        var p = safeGet(r, 'path', null);
        var q = safeGet(r, 'query', null);
        if (typeof r === 'string') {
            var rp = urlParser(r, true);
            p = rp.pathname;
            q = rp.query;
        }
        if (path === p) {
            if (exactQueryMatch) {
                return isEqual(query, q);
            }
            else {
                return isObjectMatch(query, q);
            }
        }
        return false;
    });
}
