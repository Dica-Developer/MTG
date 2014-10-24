'use strict';

angular.module('mtgApp')
  .constant('SYMBOLS_REGEX', new RegExp('([0-9WUBRGXPSTQ/]+)', 'gi'))
  .constant('SYMBOLS_REGEX_WITH_BRACES', new RegExp('({[0-9WUBRGXPSTQ/]+})', 'gi'));
