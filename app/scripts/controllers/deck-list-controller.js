'use strict';

angular.module('mtgApp')
  .controller('DeckListController', ['$scope', '$state', 'decks', function ($scope, $state, decks) {
    $scope.deckList = decks.getAll();

    $scope.addDeck = function () {
      var newDeck = decks.addNew();
      $state.go('deck-builder', {deckId: newDeck.options.id});
    };
  }]);
