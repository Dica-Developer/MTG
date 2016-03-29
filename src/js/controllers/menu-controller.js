/*@ngInject*/
export default function menuController($scope, decks) {
    let allDecks = decks.getAll();
    $scope.allDecks = [];

    function updateDeckList() {
        $scope.allDecks = [];
        allDecks.forEach((deck) => {
            let info = {
                name: deck.getName(),
                id: deck.getId()
            };
            $scope.allDecks.push(info);
        });
    }

    $scope.$watch(decks.lastChange, (newValue, oldValue) => {
        if(typeof newValue !== 'undefined' && newValue !== oldValue) {
            allDecks = decks.getAll();
            updateDeckList();
        }
    });

    updateDeckList();
};
