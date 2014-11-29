'use strict';

angular.module('mtgApp')
  .controller('UtilController', ['$scope', 'data', 'cards', function ($scope, data, cards) {
    $scope.appReady = false;
    $scope.progress = '';

    function updateProgress(progress) {
      $scope.progress = progress;
    }

    function handleError(error) {
      $scope.error = error;
    }

    function prepareDatabase() {
      var onFulfilled = function () {
        $scope.appReady = true;
      };

      cards.prepareDataBase()
        .then(onFulfilled, handleError, updateProgress);
    }


    if (!data.isAvailable()) {
      data.fetchData()
        .then(prepareDatabase, handleError, updateProgress);
    } else {
      prepareDatabase();
    }
  }]);
