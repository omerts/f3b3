import { useEffect, useState } from 'react';
import history from '../../utils/getHistory';
export var NavigationPrompt = function (_a) {
    var shouldPrompt = _a.shouldPrompt, promptRender = _a.promptRender;
    var _b = useState(), retry = _b[0], setRetry = _b[1];
    useEffect(function () {
        if (shouldPrompt) {
            var unblock_1 = history.block(function (tx) {
                setRetry(function () { return function () {
                    unblock_1();
                    tx.retry();
                }; });
            });
            return unblock_1;
        }
    }, [shouldPrompt]);
    if (!retry) {
        return null;
    }
    return promptRender(retry, function () { return setRetry(null); });
};
export default NavigationPrompt;
