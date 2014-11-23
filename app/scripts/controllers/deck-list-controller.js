'use strict';

angular.module('mtgApp')
  .controller('DeckListController', ['$scope', '$state', 'decks', function ($scope, $state, decks) {
    $scope.deckList = decks.getAll();

    $scope.removeDeck = function(event, deckId){
      event.preventDefault();
      event.stopImmediatePropagation();
      decks.removeDeck(deckId);
    };

    $scope.addDeck = function () {
      var newDeck = decks.addNew();
      $state.go('deck-builder', {deckId: newDeck.options.id});
    };

    $scope.$watch(decks.lastChange, function () {
      $scope.deckList = decks.getAll();
    });
  }]);
