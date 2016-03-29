/*@ngInject*/
export default function deckListController($scope, $state, decks) {
    let allDecks = decks.getAll();

    function updateDeckList() {
        $scope.deckList = [];
        allDecks.forEach((deck) => {
            let info = {
                name: deck.getName(),
                id: deck.getId(),
                colors: decks.getColorsOfDeck(deck.getId())
            };
            $scope.deckList.push(info);
        });
    }


    $scope.removeDeck = function (event, deckId) {
        event.preventDefault();
        event.stopImmediatePropagation();
        decks.removeDeck(deckId);
    };

    $scope.addDeck = function () {
        var newDeck = decks.addNew();
        $state.go('deck-builder', { deckId: newDeck.getId() });
    };

    $scope.$watch(decks.lastChange, (newValue, oldValue) => {
        if (typeof newValue !== 'undefined' && newValue !== oldValue) {
            allDecks = decks.getAll();
            updateDeckList();
        }
    });

    updateDeckList();
};
