'use strict';

angular.module('mtgApp')
  .controller('CardCounterController', ['$scope', 'ownCards', function ($scope, ownCards) {
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
      if ($scope.count > 0) {
        ownCards.removeCard(id);
      }
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
  }]);
