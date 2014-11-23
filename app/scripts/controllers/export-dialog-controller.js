'use strict';

angular.module('mtgApp')
  .controller('ExportDialogController', [
    '$scope',
    '$modalInstance',
    'exportCards',
    'exportDecks',
    function ($scope, $modalInstance, exportCards, exportDecks) {
      $scope.fileName = 'mtg-app-data';
      $scope.cards = exportCards;
      $scope.decks = exportDecks ? _.map(exportDecks, function (deck) {
        return {
          name: deck.name,
          id: deck.id,
          selected: true
        }
      }) : null;

      $scope.decksToExport = function(){
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
        $modalInstance.close({decks: _.filter($scope.decks, 'selected'), fileName: $scope.fileName});
      };

      $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
      };
    }]);
