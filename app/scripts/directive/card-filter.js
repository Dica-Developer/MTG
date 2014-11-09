'use strict';

angular.module('mtgApp')
  .directive('cardFilter', [function () {
    return {
      restrict: 'E',
      scope: {
        db: '=',
        filteredCards: '=',
        filterUpdated: '=',
        cardName: '='
      },
      templateUrl: 'templates/card-filter.html',
      controller: 'CardFilterController'
    };
  }]);
