'use strict';

angular.module('mtgApp')
  .directive('manaCost', ['$compile', 'SYMBOLS_REGEX', function ($compile, SYMBOLS_REGEX) {
    return {
      restrict: 'E',
      template: '<span class="mana"></span>',
      replace: true,
      scope: {
        manaCost: '@'
      },
      link: function (scope, element, attr) {
        var otherSymbols = [
          't',
          'q',
          'c'
        ];
        var isOtherSymbol = function (mana) {
          return _.contains(otherSymbols, mana);
        };

        scope.$watch('manaCost', function (newValue) {
          element.empty();
          /*istanbul ignore else*/
          if (typeof newValue !== 'undefined') {
            var manaCost = newValue.toLowerCase().match(SYMBOLS_REGEX);
            if (manaCost) {
              manaCost.forEach(function (mana) {
                mana = mana.replace('/', '');
                var image = null;
                if (isOtherSymbol(mana)) {
                  image = angular.element('<img ng-src="http://gatherer.wizards.com/Handlers/Image.ashx?size=medium&name=' + mana + '&type=symbol" width="' + attr.size + '" />');
                } else {
                  image = angular.element('<img ng-src="http://gatherer.wizards.com/Handlers/Image.ashx?size=medium&name=' + mana + '&type=symbol" width="' + attr.size + '" />');
                }
                element.append(image);
              });
            }
            $compile(element)(scope);
          }
        }, true);
      }
    };
  }]);
