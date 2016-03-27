/*@ngInject*/
export default function menuController($scope, decks) {
    $scope.allDecks = decks.getAll();
    $scope.$watch(decks.lastChange, function () {
        $scope.allDecks = decks.getAll();
    });
};
