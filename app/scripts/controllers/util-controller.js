'use strict';

angular.module('mtgApp')
  .controller('UtilController', ['$q', '$scope', 'data', 'cards', 'sets', function ($q, $scope, data, cards, sets) {
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

      $q.all([cards.prepareDataBase(), sets.prepareDataBase()]).then(onFulfilled, handleError, updateProgress);
    }


    if (!data.isAvailable()) {
      data.fetchData().then(prepareDatabase, handleError, updateProgress);
    } else {
      prepareDatabase();
    }
  }]);
