'use strict';

angular.module('mtgApp')
  .directive('cardCounter', [function () {
    return {
      restrict: 'E',
      templateUrl: '/templates/card-counter.html',
      replace: true,
      scope: {
        'cardId': '@'
      },
      controller: 'CardCounterController'
    };
  }]);
