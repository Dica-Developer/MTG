'use strict';

angular.module('mtgApp')
  .controller('MenuController', ['$scope', 'decks', function ($scope, decks) {
    $scope.allDecks = decks.getAll();
    $scope.$watch(decks.lastChange, function () {
      $scope.allDecks = decks.getAll();
    });
  }]);
