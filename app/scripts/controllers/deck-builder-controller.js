'use strict';

angular.module('mtgApp')
  .controller('DeckBuilderController', ['$scope', '$stateParams', 'decks', 'cards', function ($scope, $stateParams, decks, cards) {
    $scope.scope = $scope;
    $scope.deck = window.deck = decks.getById($stateParams.deckId);
    $scope.cards = $scope.deck.getFullCards();
    $scope.saveDeck = $scope.deck.save.bind($scope.deck);
    $scope.cardsToAdd = null;
    $scope.currentSearch = '';
    $scope.totalCardCount = $scope.deck.options.cards.length;
    $scope.sampleHand = $scope.deck.getShuffleSeven();
    $scope.typeFilter = '';

    $scope.$watch('totalCardCount', function (newValue) {
      if (newValue) {
        $scope.cards = $scope.deck.getFullCards();
      }
    });

    $scope.addCard = function (cardId) {
      deck.addCard(cardId);
      $scope.totalCardCount = $scope.deck.options.cards.length;
    };

    $scope.dropCard = function (cardId) {
      deck.dropCard(cardId);
      $scope.totalCardCount = $scope.deck.options.cards.length;
    };

    $scope.dropAll = function (cardId) {
      deck.dropAll(cardId);
      $scope.totalCardCount = $scope.deck.options.cards.length;
    };

    $scope.filterByType = function (type) {
      if ($scope.typeFilter === type) {
        $scope.typeFilter = '';
      } else {
        $scope.typeFilter = type;
      }
    };

    $scope.$watch('typeFilter', function (newValue) {
      if (newValue === '') {
        $scope.cards = $scope.deck.getFullCards();
      } else {
        var types = newValue.split('-');
        var fullDeck = deck.getFullCards();
        var filteredCards = [];
        fullDeck.forEach(function (deck) {
          if (_.isEqual(deck.types, types)) {
            filteredCards.push(deck);
          }
        });
        $scope.cards = filteredCards;
      }
    });


    $scope.alreadyInDeck = function (cardId) {
      return deck.hasCard(cardId);
    };

    $scope.$watch('currentSearch', function (newValue, oldValue) {
      if (newValue && newValue !== oldValue) {
        if (newValue === '') {
          $scope.cardsToAdd = null;
        } else {
          $scope.cardsToAdd = cards.limitFilter({name: {likenocase: newValue}}, 50);
        }
      }
    });

    $scope.shuffle = function () {
      $scope.sampleHand = $scope.deck.getShuffleSeven();
    };




  }]);
