'use strict';

angular.module('mtgApp')
.controller('MenuController', ['$scope', 'decks', function($scope, decks){
    $scope.allDecks = decks.getAll();
  }]);
