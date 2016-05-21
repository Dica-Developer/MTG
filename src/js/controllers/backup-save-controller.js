import {filter, each} from 'lodash';

/*@ngInject*/
export default function exportDialogController($scope, $uibModalInstance, exportCards, exportDecks) {
    $scope.fileName = 'mtg-app-data';
    $scope.cards = exportCards;
    $scope.decks = exportDecks ? _.map(exportDecks, (deck) => {
        return {
            name: deck.name,
            id: deck.id,
            selected: true
        };
    }) : null;

    $scope.decksToExport = () => filter($scope.decks, 'selected').length;

    $scope.toggleSelected = (selected) => {
        each($scope.decks, deck => { deck.selected = selected });
    };

    $scope.ok = function () {
        $uibModalInstance.close({ decks: _.filter($scope.decks, 'selected'), fileName: $scope.fileName });
    };

    $scope.cancel = () => $uibModalInstance.dismiss('cancel');
};
