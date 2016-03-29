import {reduce} from 'lodash';

/*@ngInject*/
export default function ColorService(CARD_COLOR_REGEX, CARD_COLOR_BIT_MAP) {
    'use strict';

    this.getColorBitsForDb = (manaCost) => {
        let result = 0;
        if (manaCost) {
            let costArray = manaCost.match(CARD_COLOR_REGEX);
            if (costArray !== null && costArray.length > 0) {
                result = costArray.reduce(function (accumulator, color) {
                    accumulator = accumulator | CARD_COLOR_BIT_MAP[color];
                    return accumulator;
                }, result);
            }
        }
        return result;
    };

    this.getColorBitsFromMap = (colorMap) => {
        return reduce(colorMap, (accumulator, enabled, color) => {
            if (enabled) {
                accumulator = accumulator | CARD_COLOR_BIT_MAP[color];
            }
            return accumulator;
        }, 0);
    };

};
