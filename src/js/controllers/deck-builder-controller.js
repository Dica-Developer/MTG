import CardModalTplUrl from '../../templates/card-modal.ejs';

/*@ngInject*/
export default function deckBuilderController($scope, $stateParams, $uibModal, decks, cards, ownCards) {
    $scope.scope = $scope;
    $scope.db = cards.db;
    $scope.ownCards = ownCards;
    $scope.deck = decks.getById($stateParams.deckId);
    $scope.cards = $scope.deck.getFullCards();
    $scope.saveDeck = $scope.deck.save.bind($scope.deck);
    $scope.totalCardCount = $scope.deck.options.cards.length;
    $scope.sampleHand = [];
    $scope.typeFilter = '';
    $scope.orderPredicate = 'types';
    $scope.orderReverse = false;
    $scope.sideboard = $scope.deck.getFullSideboard();
    $scope.editname = false;

    $scope.editName = function () {
        $scope.editname = true;
    };

    $scope.saveName = function () {
        $scope.saveDeck();
        $scope.editname = false;
    };

    var updateManaCurve = null,
        shuffleCount = 7;

    $scope.$watch('totalCardCount', function (newValue) {
        if (newValue) {
            $scope.cards = $scope.deck.getFullCards();
            $scope.sideboard = $scope.deck.getFullSideboard();
            updateManaCurve();
        }
    });

    $scope.addCard = function (event, cardId) {
        event.stopPropagation();
        $scope.deck.addCard(cardId);
        $scope.totalCardCount = $scope.deck.options.cards.length;
    };

    $scope.dropCard = function (event, cardId) {
        event.stopPropagation();
        $scope.deck.dropCard(cardId);
        $scope.totalCardCount = $scope.deck.options.cards.length;
    };

    $scope.dropAll = function (event, cardId) {
        event.stopPropagation();
        $scope.deck.dropAll(cardId);
        $scope.totalCardCount = $scope.deck.options.cards.length;
    };

    $scope.addCardToSideBoard = function (event, cardId) {
        event.stopPropagation();
        $scope.deck.addCardToSideBoard(cardId);
        $scope.totalCardCount = $scope.deck.options.cards.length;
    };

    $scope.dropCardFromSideBoard = function (event, cardId) {
        event.stopPropagation();
        $scope.deck.dropCardFromSideBoard(cardId);
        $scope.totalCardCount = $scope.deck.options.cards.length;
    };

    $scope.dropAllFromSideboard = function (event, cardId) {
        event.stopPropagation();
        $scope.deck.dropAllFromSideboard(cardId);
        $scope.totalCardCount = $scope.deck.options.cards.length;
    };

    $scope.moveCardToSideboard = function (event, cardId) {
        event.stopPropagation();
        $scope.deck.moveCardToSideboard(cardId);
        $scope.totalCardCount = $scope.deck.options.cards.length;
    };

    $scope.moveCardToMain = function (event, cardId) {
        event.stopPropagation();
        $scope.deck.moveCardToMain(cardId);
        $scope.totalCardCount = $scope.deck.options.cards.length;
    };

    $scope.filterByType = function (type) {
        if ($scope.typeFilter === type) {
            $scope.typeFilter = '';
        } else {
            $scope.typeFilter = type;
        }
    };

    $scope.alreadyInDeck = function (cardId) {
        return $scope.deck.hasCard(cardId);
    };

    $scope.shuffle = function () {
        shuffleCount = 7;
        $scope.sampleHand = $scope.deck.getShuffle(shuffleCount);
    };

    $scope.mulligan = function () {
        if (shuffleCount > 1) {
            shuffleCount = shuffleCount - 1;
            $scope.sampleHand = $scope.deck.getShuffle(shuffleCount);
        }
    };

    $scope.showCardModal = function (card) {

        $uibModal.open({
            templateUrl: CardModalTplUrl,
            controller: 'CardModalController',
            size: 'lg',
            resolve: {
                card: function () {
                    return card;
                }
            }
        });
    };

    //start add card tab
    $scope.cardsToAdd = [];
    $scope.filteredCards = [];
    $scope.currentSearch = '';
    $scope.searchResultLimit = 20;
    $scope.maxResultLength = 20;
    $scope.currentPage = 1;
    $scope.totalItems = 0;
    $scope.filterCollapsed = true;
    function updateList() {
        $scope.cardsToAdd = $scope.filteredCards.slice(($scope.currentPage - 1) * $scope.maxResultLength, $scope.currentPage * $scope.maxResultLength);
        $scope.totalItems = $scope.filteredCards.length;
    }

    $scope.$watch('currentPage', updateList);
    $scope.$watch('maxResultLength', updateList);
    $scope.$watch('filterUpdateTimeStamp', updateList);
    //end add card tab

    $scope.manaCostData = {
        labels: [],
        datasets: []
    };

    $scope.manaCostOptions = {
        scaleBeginAtZero: true,
        scaleShowGridLines: true,
        scaleGridLineColor: 'rgba(0,0,0,.05)',
        scaleGridLineWidth: 1,
        barShowStroke: true,
        barStrokeWidth: 2,
        barValueSpacing: 5,
        barDatasetSpacing: 1
    };

    updateManaCurve = function () {
        $scope.manaCostData.labels = [];
        $scope.manaCostData.datasets = [];
        var dataSet = {
            label: '',
            fillColor: 'rgba(220,220,220,0.5)',
            strokeColor: 'rgba(220,220,220,0.8)',
            highlightFill: 'rgba(220,220,220,0.75)',
            highlightStroke: 'rgba(220,220,220,1)',
            data: []
        };
        _.each($scope.deck.getManaCurve(), function (count, mana) {
            if (mana !== 'undefined') {
                $scope.manaCostData.labels.push('CMC ' + mana);
                dataSet.data.push(count);
            }
        });
        $scope.manaCostData.datasets.push(dataSet);
    };

};
