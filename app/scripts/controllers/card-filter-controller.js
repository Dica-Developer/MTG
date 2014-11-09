'use strict';

angular.module('mtgApp')
  .controller('CardFilterController', ['$scope', 'cards', function ($scope, cards) {
    $scope.scope = $scope;
    $scope.cardName = '';
    $scope.filteredCards = $scope.db().get();
    cards.fetchSetList().then(function(data){
      $scope.setList = data;
    });
    $scope.filterUpdated = new Date().getTime();
    $scope.selectedSets = null;
    $scope.combinedManaCost = -1;
    $scope.colors = {
      White: false,
      Black: false,
      Green: false,
      Blue: false,
      Red: false
    };

    function filterCards(newValue, oldValue) {
      if(newValue !== null && newValue !== oldValue){
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
        $scope.filteredCards = $scope.db(searchQuery).get();
        $scope.filterUpdated = new Date().getTime();
      }
    }

    $scope.$watch('cardName', filterCards);
    $scope.$watch('selectedSets', filterCards);
    $scope.$watch('combinedManaCost', filterCards);
    $scope.$watch('colors', filterCards, true);
  }]);
