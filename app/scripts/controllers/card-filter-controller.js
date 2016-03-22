'use strict';

angular.module('mtgApp')
  .controller('CardFilterController', ['$scope', '$timeout', 'data', function ($scope, $timeout, data) {
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

    function filterCards(newValue, oldValue) {
      if (newValue !== null && newValue !== oldValue) {
        var searchQuery = {};
        var name = $scope.cardName;
        var mtgSets = $scope.selectedSets;
        var cmc = $scope.combinedManaCost;
        var colors = _.reduce($scope.colors, function (accumulator, enabled, color) {
          if (enabled) {
            accumulator.push(color);
          }
          return accumulator;
        }, []);


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

        if (colors.length > 0) {
          var regexString = new RegExp(colors.join('|'), 'g');
          searchQuery.manaCost = {'regex': regexString};
        }

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
        data.getSetList()
          .then(function (setList) {
            $scope.setList = setList;
          });
      }
    };

    getSetList();
  }]);
