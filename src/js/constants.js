import angular from 'angular';

export default angular.module('Constants', [])
    .constant('SYMBOLS_REGEX', new RegExp('([0-9WUBRGXPSTQC/]+)', 'gi'))
    .constant('CARD_COLOR_REGEX', new RegExp('([WUBRGC]+)', 'gi'))
    .constant('SYMBOLS_REGEX_WITH_BRACES', new RegExp('({[0-9WUBRGXPSTQC/]+})', 'gi'))
    .constant('TEXT_BETWEEN_PARANTHESES', /\(([^)]+)\)/)
    .constant('CARD_COLOR_BIT_MAP', { 'W': 1, 'U': 2, 'B': 4, 'R': 8, 'G': 16, 'C': 32 })
    .constant('BACKUP_DATA_VERSION', '0.0.1');
