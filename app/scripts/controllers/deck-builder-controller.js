'use strict';

angular.module('mtgApp')
  .filter('cardTypeFilter', [function () {
    return function (items, filter) {
      return items.filter(function (item) {
        return filter === '' || _.isEqual(item.types, filter.split('-'));
      });
    };
  }])
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
    $scope.sideboard = $scope.deck.getFullSideboard();

    var updateManaCurve = null;

    window.deck = $scope.deck;

    $scope.$watch('totalCardCount', function (newValue) {
      if (newValue) {
        $scope.cards = $scope.deck.getFullCards();
        $scope.sideboard = $scope.deck.getFullSideboard();
        updateManaCurve()
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

    $scope.addCardToSideBoard = function (event, cardId) {
      event.stopPropagation();
      $scope.deck.addCardToSideBoard(cardId);
      $scope.totalCardCount = $scope.deck.options.cards.length;
    };

    $scope.dropCardFromSideBoard = function (event, cardId) {
      event.stopPropagation();
      $scope.deck.dropCardFromSideBoard(cardId);
      $scope.totalCardCount = $scope.deck.options.cards.length;
    };

    $scope.dropAllFromSideboard = function (event, cardId) {
      event.stopPropagation();
      $scope.deck.dropAllFromSideboard(cardId);
      $scope.totalCardCount = $scope.deck.options.cards.length;
    };

    $scope.moveCardToSideboard = function (event, cardId) {
      event.stopPropagation();
      $scope.deck.moveCardToSideboard(cardId);
      $scope.totalCardCount = $scope.deck.options.cards.length;
    };

    $scope.moveCardToMain = function (event, cardId) {
      event.stopPropagation();
      $scope.deck.moveCardToMain(cardId);
      $scope.totalCardCount = $scope.deck.options.cards.length;
    };

    $scope.filterByType = function (type) {
      if ($scope.typeFilter === type) {
        $scope.typeFilter = '';
      } else {
        $scope.typeFilter = type;
      }
    };

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

    $scope.manaCostData = {
      labels: [],
      datasets: []
    };

    $scope.manaCostOptions = {
      responsive: true,
      scaleBeginAtZero : true,
      scaleShowGridLines : true,
      scaleGridLineColor : "rgba(0,0,0,.05)",
      scaleGridLineWidth : 1,
      barShowStroke : true,
      barStrokeWidth : 2,
      barValueSpacing : 5,
      barDatasetSpacing : 1
    };

    updateManaCurve = function(){
      $scope.manaCostData.labels = [];
      $scope.manaCostData.datasets = [];
      var dataSet = {
        label: 'My First dataset',
        fillColor: 'rgba(220,220,220,0.5)',
        strokeColor: 'rgba(220,220,220,0.8)',
        highlightFill: 'rgba(220,220,220,0.75)',
        highlightStroke: 'rgba(220,220,220,1)',
        data: []
      };
      _.each($scope.deck.getManaCurve(), function(count, mana){
        if(mana !== 'undefined'){
          $scope.manaCostData.labels.push('CMC ' + mana);
          dataSet.data.push(count)
        }
      });
      $scope.manaCostData.datasets.push(dataSet);
    };

  }]);
