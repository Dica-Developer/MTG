'use strict';

angular.module('mtgApp')
  .controller('CardFilterController', ['$scope', '$timeout', 'data', 'cardColor', 'sets', function ($scope, $timeout, data, cardColor, sets) {
    $scope.scope = $scope;
    $scope.cardName = '';
    $scope.filteredCards = $scope.db().get();
    $scope.filterUpdated = new Date().getTime();
    $scope.selectedSets = null;
    $scope.combinedManaCost = -1;
    $scope.colors = {
      W: false,
      B: false,
      G: false,
      U: false,
      R: false,
      C: false
    };

    window.db = $scope.db;

    function filterCards(newValue, oldValue) {
      if (newValue !== null && newValue !== oldValue) {
        var searchQuery = {};
        var name = $scope.cardName;
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

        if (cmc >= 0) {
          searchQuery.cmc = cmc;
        }

        searchQuery.cardColor = cardColor.getColorBitsFromMap($scope.colors);

        $scope.filteredCards = $scope.db(searchQuery).get();
        $scope.filterUpdated = new Date().getTime();
      }
    }

    $scope.$watch('cardName', filterCards);
    $scope.$watch('selectedSets', filterCards);
    $scope.$watch('combinedManaCost', filterCards);
    $scope.$watch('colors', filterCards, true);

    var getSetList = function () {
      if (!data.isAvailable()) {
        $timeout(getSetList, 5000);
      } else {
        $scope.setList = sets.filter();
      }
    };

    getSetList();
  }]);
