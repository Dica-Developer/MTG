'use strict';

angular.module('mtgApp')
  .filter('propsFilter', function () {
    return function (items, props) {
      var out = [];

      if (angular.isArray(items)) {
        items.forEach(function (item) {
          var itemMatches = false;

          var keys = Object.keys(props);
          for (var i = 0; i < keys.length; i++) {
            var prop = keys[i];
            var text = props[prop].toLowerCase();
            if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
              itemMatches = true;
              break;
            }
          }

          if (itemMatches) {
            out.push(item);
          }
        });
      } else {
        // Let the output be the input untouched
        out = items;
      }

      return out;
    };
  })
  .controller('CardExplorerController', [
    '$scope',
    '$modal',
    '$timeout',
    'cards',
    'allCards',
    'setList',
    function ($scope, $modal, $timeout, cards, allCards, setList) {
      var filteredCards = [];
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

      var updateList = function () {
        $scope.cards = filteredCards.slice(($scope.currentPage - 1) * $scope.maxResultLength, $scope.currentPage * $scope.maxResultLength);
      };

      $scope.$watch('currentPage', updateList);
      $scope.$watch('maxResultLength', updateList);

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
        filteredCards = cards.filter(searchQuery);
        $scope.cards = filteredCards.slice(($scope.currentPage - 1) * $scope.maxResultLength, $scope.currentPage * $scope.maxResultLength);
        $scope.totalItems = filteredCards.length;
      }

      $scope.$watch('searchValue', filterCards);
      $scope.$watch('selectedSets', filterCards);
      $scope.$watch('combinedManaCost', filterCards);
      $scope.$watch('colors', filterCards, true);
    }
  ]);
