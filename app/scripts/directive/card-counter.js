'use strict';

angular.module('mtgApp')
  .directive('cardCounter', [function () {
    return {
      restrict: 'E',
      templateUrl: '/templates/card-counter.html',
      replace: true,
      scope: {
        'cardId': '@',
        'edit': '@'
      },
      controller: ['$scope', 'ownCards', function ($scope, ownCards) {
        var id = $scope.cardId;
        $scope.count = ownCards.getCountOf(id);

        $scope.addCard = function (event) {
          event.preventDefault();
          event.stopImmediatePropagation();
          ownCards.addCard(id);
        };

        $scope.removeCard = function (event) {
          event.preventDefault();
          event.stopImmediatePropagation();
          ownCards.removeCard(id);
        };

        var getCount = function () {
          return ownCards.getCountOf(id);
        };

        $scope.$watch(getCount, function (newValue, oldValue) {
          if (newValue !== oldValue) {
            $scope.count = newValue;
          }
        });

        $scope.$watch('cardId', function (newValue, oldValue) {
          if (newValue && newValue !== oldValue) {
            id = newValue;
            $scope.count = ownCards.getCountOf(id);
          }
        });
      }]
    };
  }]);
