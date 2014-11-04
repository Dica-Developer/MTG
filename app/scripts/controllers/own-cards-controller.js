'use strict';

angular.module('mtgApp')
  .controller('OwnCardsController', ['$scope', '$modal', 'ownCards', 'setList', 'cards', function($scope, $modal, ownCards, setList, cards){
    var filteredCards = [],
      ownCardsTmpDB = TAFFY();

    ownCardsTmpDB.insert(cards.filter({
      multiverseid: _.map(_.pluck(ownCards.getAll(), 'multiverseid'), Number)
    }));

    $scope.scope = $scope;
    $scope.setList = setList;
    $scope.selectedSets = null;
    $scope.searchValue = '';
    $scope.maxResultLength = 20;
    $scope.currentPage = 1;
    $scope.cards = [];
    $scope.totalItems = 0;
    $scope.combinedManaCost = 0;
    $scope.colors = {
      White: false,
      Black: false,
      Green: false,
      Blue: false,
      Red: false
    };

    function updateList() {
      $scope.cards = filteredCards.slice(($scope.currentPage - 1) * $scope.maxResultLength, $scope.currentPage * $scope.maxResultLength);
    }

    function filterCards() {
      var searchQuery = {};
      var name = $scope.searchValue;
      var mtgSets = $scope.selectedSets;
      var cmc = $scope.combinedManaCost;

      if (name !== '') {
        searchQuery.concatNames = {
          likenocase: name
        };
      }

      if (mtgSets && mtgSets.length > 0) {
        var setsQueries = [];
        mtgSets.forEach(function (mtgSet) {
          setsQueries.push(mtgSet.code);
        });
        searchQuery.setCode = setsQueries;
      }

      if (cmc > 0) {
        searchQuery.cmc = cmc;
      }

      var colorQueries = {hasAll: []};
      _.each($scope.colors, function (enabled, color) {
        if (enabled) {
          colorQueries.hasAll.push(color);
        }
      });

      if (colorQueries.hasAll.length > 0) {
        searchQuery.colors = colorQueries;
      }

      $scope.currentPage = 1;
      filteredCards = ownCardsTmpDB(searchQuery).get();
      $scope.cards = filteredCards.slice(($scope.currentPage - 1) * $scope.maxResultLength, $scope.currentPage * $scope.maxResultLength);
      $scope.totalItems = filteredCards.length;
    }

    $scope.showCardModal = function (card) {

      var modalInstance = $modal.open({
        templateUrl: '/templates/card-modal.html',
        controller: 'CardModalController',
        resolve: {
          card: function () {
            return card;
          },
          showCounter: function () {
            return true;
          }
        }
      });

      modalInstance.result.then(function (selectedItem) {
        $scope.selected = selectedItem;
      });
    };

    $scope.$watch('searchValue', filterCards);
    $scope.$watch('selectedSets', filterCards);
    $scope.$watch('combinedManaCost', filterCards);
    $scope.$watch('colors', filterCards, true);

    $scope.$watch('currentPage', updateList);
    $scope.$watch('maxResultLength', updateList);
  }]);