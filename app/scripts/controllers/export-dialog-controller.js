'use strict';

angular.module('mtgApp')
  .controller('ExportDialogController', [
    '$scope',
    '$uibModalInstance',
    'exportCards',
    'exportDecks',
    function ($scope, $uibModalInstance, exportCards, exportDecks) {
      $scope.fileName = 'mtg-app-data';
      $scope.cards = exportCards;
      $scope.decks = exportDecks ? _.map(exportDecks, function (deck) {
        return {
          name: deck.name,
          id: deck.id,
          selected: true
        };
      }) : null;

      $scope.decksToExport = function () {
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
        $uibModalInstance.close({decks: _.filter($scope.decks, 'selected'), fileName: $scope.fileName});
      };

      $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };
    }]);
