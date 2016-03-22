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
      link: function (scope, element) {
        var otherSymbols = [
          't',
          'q'
        ];
        var otherManaMap = {
          't': 'tap',
          'q': 'untap'
        };
        var isOtherSymbol = function (mana) {
          return _.includes(otherSymbols, mana);
        };

        scope.$watch('manaCost', function (newValue) {
          element.empty();
          /*istanbul ignore else*/
          if (typeof newValue !== 'undefined') {
            var manaCost = newValue.toLowerCase().match(SYMBOLS_REGEX);
            if (manaCost) {
              manaCost.forEach(function (mana) {
                mana = mana.replace('/', '');
                if (isOtherSymbol(mana)) {
                  mana = otherManaMap[mana];
                }
                var icon = angular.element('<i class="ms ms-cost ms-' + mana + '"></i>');
                element.append(icon);
              });
            }
            $compile(element)(scope);
          }
        }, true);
      }
    };
  }]);
