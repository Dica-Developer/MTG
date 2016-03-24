'use strict';

angular.module('mtgApp')
  .controller('ImportDialogController', [
    '$scope',
    '$uibModalInstance',
    'decks',
    'importCards',
    'importDecks',
    function ($scope, $uibModalInstance, decks, importCards, importDecks) {
      $scope.cards = importCards;
      $scope.decks = _.map(importDecks, function (deck) {
        return {
          name: deck.name,
          id: deck.id,
          selected: true,
          exists: decks.existsByName
        };
      });

      $scope.decksToImport = function () {
        return _.filter($scope.decks, 'selected').length;
      };

      $scope.deselectAll = function () {
        _.forEach($scope.decks, function (deck) {
          deck.selected = false;
        });
      };

      $scope.selectAll = function () {
        _.forEach($scope.decks, function (deck) {
          deck.selected = true;
        });
      };

      $scope.ok = function () {
        var  selectedDecks = _.map(_.filter($scope.decks, 'selected'), function(deck){
          var orgDeck = _.find(importDecks, { 'id': deck.id});
          return _.assign({}, orgDeck, { 'name': deck.name });
        });
        $uibModalInstance.close({ decks: selectedDecks, cards: importCards });
      };

      $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };
    }]);
