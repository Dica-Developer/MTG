'use strict';

angular.module('mtgApp')
  .controller('CardModalController', ['$scope', '$modalInstance', 'card', function ($scope, $modalInstance, card) {
    $scope.card = card;

    $scope.ok = function () {
      $modalInstance.close();
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  }]);
