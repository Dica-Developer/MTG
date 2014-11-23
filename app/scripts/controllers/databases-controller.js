'use strict';

angular.module('mtgApp')
  .controller('DatabasesController', ['$scope', '$modal', 'decks', 'ownCards', function ($scope, $modal, decks, ownCards) {

    function readFile(file, callback) {
      var reader = new FileReader();
      reader.readAsText(file, 'UTF-8');
      reader.onload = callback;
    }

    function validateImport(data, field) {
      var importData;
      try {
        importData = JSON.parse(data);
        if (field) {
          if (field === 'card') {
            importData = _.has(importData, field) ? importData[field] : importData['ownCards'];
          } else {
            importData = importData[field];
          }
        }
      } catch (err) {
        console.error('Cannot parse data');
        console.error(err);
      }

      return importData || false;
    }

    function showImportDialog(cards, decks) {
      return $modal.open({
        templateUrl: 'templates/import-dialog.html',
        controller: 'ImportDialogController',
        resolve: {
          importCards: function () {
            return cards;
          },
          importDecks: function () {
            return decks;
          }
        }
      });
    }

    $scope.importComplete = function (event, files) {
      readFile(files[0], function (event) {
        var validData = validateImport(event.target.result, null),
          modalInstance;

        if (validData) {
          var cards = validData.cards || validData.ownCards;
          modalInstance = showImportDialog(cards, validData.decks);
          modalInstance.result.then(function (selectedDecks) {
            var decksToImport = _.map(selectedDecks, function (deck) {
              var deckToImport = validData.decks[deck.id];
              delete deckToImport.id;
              deckToImport.name = deck.name;
              return deckToImport;
            });
            decks.importData(decksToImport);
            ownCards.importData(cards);

            //Garbage Collector
            modalInstance = null;
            validData = null;
          }, function () {
            console.info('Modal dismissed at: ' + new Date());
          });
        } else {

        }
      });
    };

    $scope.importCards = function (event, files) {
      readFile(files[0], function (event) {
        var validCards = validateImport(event.target.result, 'cards');

        if (validCards) {
          ownCards.importData(validCards);
        }
      });
    };

    $scope.importDecks = function (event, files) {
      readFile(files[0], function (event) {
        var validDecks = validateImport(event.target.result, 'decks'), modalInstance;

        if (validDecks) {
          modalInstance = showImportDialog(null, validDecks);
          modalInstance.result.then(function (selectedDecks) {
            var decksToImport = _.map(selectedDecks, function (deck) {
              var deckToImport = validDecks[deck.id];
              delete deckToImport.id;
              deckToImport.name = deck.name;
              return deckToImport;
            });
            decks.importData(decksToImport);
          }, function () {
            console.info('Modal dismissed at: ' + new Date());
          });
        } else {

        }
      });
    };

    function showExportDialog(cards, decks) {
      return $modal.open({
        templateUrl: 'templates/export-dialog.html',
        controller: 'ExportDialogController',
        resolve: {
          exportCards: function () {
            return cards;
          },
          exportDecks: function () {
            return decks;
          }
        }
      });
    }

    function startDownloadData(dataToExport, name) {
      var blob = new Blob([JSON.stringify(dataToExport)], {type: 'application/json;charset=utf-8'});
      saveAs(blob, name + '.json');
    }

    $scope.exportComplete = function () {
      var allDecks = decks.exportData(),
        allCards = ownCards.getAll(),
        modalInstance = showExportDialog(allCards, allDecks);

      modalInstance.result.then(function (data) {
        var decksToExport = {};

        _.forEach(data.decks, function (deck) {
          decksToExport[deck.id] = allDecks[deck.id];
        });

        var dataToExport = {
          cards: allCards,
          decks: decksToExport
        };

        startDownloadData(dataToExport, data.fileName);
      });
    };

    $scope.exportCards = function () {
      var allCards = ownCards.getAll(),
        modalInstance = showExportDialog(allCards, null);

      modalInstance.result.then(function (data) {
        var dataToExport = {
          cards: allCards
        };

        startDownloadData(dataToExport, data.fileName);
      });
    };

    $scope.exportDecks = function () {
      var allDecks = decks.exportData(),
        modalInstance = showExportDialog(null, allDecks);

      modalInstance.result.then(function (data) {
        var decksToExport = {};

        _.forEach(data.decks, function (deck) {
          decksToExport[deck.id] = allDecks[deck.id];
        });

        var dataToExport = {
          decks: decksToExport
        };

        startDownloadData(dataToExport, data.fileName);
      });
    };

  }]);
