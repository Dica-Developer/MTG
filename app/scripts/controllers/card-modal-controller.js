'use strict';

angular.module('mtgApp')
  .controller('CardModalController', ['$scope', '$modalInstance', 'card', 'showCounter', function ($scope, $modalInstance, card, showCounter) {
    $scope.card = card;
    $scope.showCounter = showCounter;

    $scope.ok = function () {
      $modalInstance.close();
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  }]);
