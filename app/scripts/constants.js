'use strict';

angular.module('mtgApp')
  .constant('SYMBOLS_REGEX', new RegExp('([0-9WUBRGXPSTQC/]+)', 'gi'))
  .constant('SYMBOLS_REGEX_WITH_BRACES', new RegExp('({[0-9WUBRGXPSTQC/]+})', 'gi'));
