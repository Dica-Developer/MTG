'use strict';

angular.module('mtgApp')
  .controller('CardModalController', ['$scope', '$uibModalInstance', 'card', function ($scope, $uibModalInstance, card) {
    $scope.card = card;

    $scope.ok = function () {
      $uibModalInstance.close();
    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  }]);
