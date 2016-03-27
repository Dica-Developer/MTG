/*@ngInject*/
export default function colorService(CARD_COLOR_REGEX, CARD_COLOR_BIT_MAP) {
    'use strict';

    function getColorBitsForDb(manaCost) {
        var result = 0;
        if (manaCost) {
            var costArray = manaCost.match(CARD_COLOR_REGEX);
            if (costArray !== null && costArray.length > 0) {
                result = costArray.reduce(function (accumulator, color) {
                    accumulator = accumulator | CARD_COLOR_BIT_MAP[color]; // jshint ignore:line
                    return accumulator;
                }, result);
            }
        }
        return result;
    }

    function getColorBitsFromMap(colorMap) {
        return _.reduce(colorMap, function (accumulator, enabled, color) {
            if (enabled) {
                accumulator = accumulator | CARD_COLOR_BIT_MAP[color]; // jshint ignore:line
            }
            return accumulator;
        }, 0);
    }

    return {
        getColorBitsForDb: getColorBitsForDb,
        getColorBitsFromMap: getColorBitsFromMap
    };

};
