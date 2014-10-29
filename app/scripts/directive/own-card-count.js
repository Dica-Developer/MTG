'use strict';

angular.module('mtgApp')
  .directive('ownCardCount', ['$compile', 'ownCards', function ($compile, ownCards) {
    return {
      restrict: 'E',
      template: '<span class="label secondary">{{count}}</span>',
      replace: true,
      scope: {
        'cardId': '@'
      },
      link: function (scope) {
        scope.$watch('cardId', function (newValue) {
          if (newValue) {
            scope.count = ownCards.getCountOf(newValue);
          }
        });
      }
    };
  }]);
