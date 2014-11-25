'use strict';

angular.module('mtgApp')
  .controller('UtilController', ['$scope', '$state', 'data', 'cards', function ($scope, $state, data, cards) {
    $scope.appReady = false;
    $scope.progress = '';

    function updateProgress(message) {
      console.log(message);
      $scope.progress = message;
    }

    function handleError(error) {
      $scope.error = error;
    }

    function prepareDatabase() {
      var onFulfilled = function () {
        $scope.appReady = true;
        $state.go('card-explorer');
        console.log('success');
      };

      cards.prepareDataBase()
        .then(onFulfilled, handleError, updateProgress);
    }


    if (!data.isAvailable()) {

      data.getCardVersion()
        .success(function (data) {
          console.log('Card version: %s', data.version);
        });

      data.fetchData()
        .then(prepareDatabase, handleError, updateProgress);
    } else {
      prepareDatabase();
    }
  }]);
