'use strict';

angular.module('mtgApp')
  .controller('DeckBuilderController', ['$scope', '$stateParams', '$modal', 'decks', 'cards', 'ownCards', function ($scope, $stateParams, $modal, decks, cards, ownCards) {
    $scope.scope = $scope;
    $scope.ownCards = ownCards;
    $scope.deck = decks.getById($stateParams.deckId);
    $scope.cards = $scope.deck.getFullCards();
    $scope.saveDeck = $scope.deck.save.bind($scope.deck);
    $scope.cardsToAdd = null;
    $scope.currentSearch = '';
    $scope.searchResultLimit = 20;
    $scope.totalCardCount = $scope.deck.options.cards.length;
    $scope.sampleHand = $scope.deck.getShuffleSeven();
    $scope.typeFilter = '';
    $scope.orderPredicate = 'types';
    $scope.orderReverse = false;

    $scope.$watch('totalCardCount', function (newValue) {
      if (newValue) {
        $scope.cards = $scope.deck.getFullCards();
      }
    });

    $scope.addCard = function (event, cardId) {
      event.stopPropagation();
      $scope.deck.addCard(cardId);
      $scope.totalCardCount = $scope.deck.options.cards.length;
    };

    $scope.dropCard = function (event, cardId) {
      event.stopPropagation();
      $scope.deck.dropCard(cardId);
      $scope.totalCardCount = $scope.deck.options.cards.length;
    };

    $scope.dropAll = function (event, cardId) {
      event.stopPropagation();
      $scope.deck.dropAll(cardId);
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
        var fullDeck = $scope.deck.getFullCards();
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
      return $scope.deck.hasCard(cardId);
    };

    var filterCards = function filterCards(newValue, oldValue) {
      if (newValue && newValue !== oldValue) {
        $scope.cardsToAdd = cards.limitFilter({name: {likenocase: $scope.currentSearch}}, $scope.searchResultLimit);
      }
    };

    $scope.$watch('currentSearch', filterCards);
    $scope.$watch('searchResultLimit', filterCards);

    $scope.shuffle = function () {
      $scope.sampleHand = $scope.deck.getShuffleSeven();
    };

    $scope.showCardModal = function (card) {

      var modalInstance = $modal.open({
        templateUrl: '/templates/card-modal.html',
        controller: 'CardModalController',
        resolve: {
          card: function () {
            return card;
          },
          showCounter: function () {
            return false;
          }
        }
      });

      modalInstance.result.then(function (selectedItem) {
        $scope.selected = selectedItem;
      });
    };
  }]);
