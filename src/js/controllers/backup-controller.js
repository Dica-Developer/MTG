import BackupLoadTplUrl from '../../templates/backup-load-dialog.ejs';
import BackupSaveTplUrl from '../../templates/backup-save-dialog.ejs';

/*@ngInject*/
export default function BackupController($scope, $uibModal, backup, BACKUP_DATA_VERSION) {

    function readFile(file, callback) {
        var reader = new FileReader();
        reader.readAsText(file, 'UTF-8');
        reader.onload = callback;
    }

    function showImportDialog(cards, decks) {
        return $uibModal.open({
            templateUrl: BackupLoadTplUrl,
            controller: 'BackupLoadController',
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
            var validData = backup.getImportData(event.target.result),
                modalInstance;

            if (validData) {
                modalInstance = showImportDialog(validData.cards, validData.decks);
                modalInstance.result.then(backup.importData);
            } else {

            }
        });
    };

    $scope.importCards = function (event, files) {
        readFile(files[0], function (event) {
            var validData = backup.getImportData(event.target.result);

            if (validData) {
                delete validData.decks;
                backup.importData(validData);
            }
        });
    };

    $scope.importDecks = function (event, files) {
        readFile(files[0], function (event) {
            var validData = backup.getImportData(event.target.result), modalInstance;

            if (validData) {
                modalInstance = showImportDialog(null, validData.decks);
                modalInstance.result.then(backup.importData);
            } else {

            }
        });
    };

    function showExportDialog(cards, decks) {
        return $uibModal.open({
            templateUrl: BackupSaveTplUrl,
            controller: 'BackupSaveController',
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
        dataToExport.version = BACKUP_DATA_VERSION;
        var blob = new Blob([JSON.stringify(dataToExport)], { type: 'application/json;charset=utf-8' });
        saveAs(blob, name + '.json');
    }

    $scope.exportComplete = function () {
        var allDecks = backup.getDecksForExport(),
            allCards = backup.getCardsForExport(),
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
        var allCards = backup.getCardsForExport(),
            modalInstance = showExportDialog(allCards, null);

        modalInstance.result.then(function (data) {
            var dataToExport = {
                cards: allCards
            };

            startDownloadData(dataToExport, data.fileName);
        });
    };

    $scope.exportDecks = function () {
        var allDecks = backup.getDecksForExport(),
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

};
