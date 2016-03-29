import CardModalTplUrl from '../../templates/card-modal.ejs';
import {each} from 'lodash';

/*@ngInject*/
export default function deckBuilderController($scope, $stateParams, $uibModal, decks, cards, ownCards) {
    $scope.scope = $scope;
    $scope.db = cards.db;
    $scope.ownCards = ownCards;
    $scope.deck = decks.getById($stateParams.deckId);
    $scope.cards = decks.getCardsOfDeck($scope.deck.getId());
    $scope.saveDeck = decks.saveDeckById;
    $scope.totalCardCount = $scope.deck.getCardCount();
    $scope.sampleHand = [];
    $scope.typeFilter = '';
    $scope.orderPredicate = 'types';
    $scope.orderReverse = false;
    $scope.sideboard = decks.getSideboardCardsOfDeck($scope.deck.getId());
    $scope.editname = false;
    $scope.deckMeta = decks.getMetaDataOfDeck($scope.deck.getId());

    $scope.editName = function () {
        $scope.editname = true;
    };

    $scope.saveName = function () {
        $scope.saveDeck($scope.deck.getId());
        $scope.editname = false;
    };

    var updateManaCurve = null,
        shuffleCount = 7;

    $scope.$watch('totalCardCount', (newValue, oldValue) => {
        if (newValue && newValue !== oldValue) {
            $scope.cards = decks.getCardsOfDeck($scope.deck.getId());
            $scope.sideboard = decks.getSideboardCardsOfDeck($scope.deck.getId());
            $scope.deckMeta = decks.getMetaDataOfDeck($scope.deck.getId());
            updateManaCurve();
        }
    });

    $scope.addCard = function (event, cardId) {
        event.stopPropagation();
        $scope.deck.addCard(cardId);
        $scope.totalCardCount = $scope.deck.getCardCount();
    };

    $scope.dropCard = function (event, cardId) {
        event.stopPropagation();
        $scope.deck.dropCard(cardId);
        $scope.totalCardCount = $scope.deck.getCardCount();
    };

    $scope.dropAll = function (event, cardId) {
        event.stopPropagation();
        $scope.deck.dropAll(cardId);
        $scope.totalCardCount = $scope.deck.getCardCount();
    };

    $scope.addCardToSideBoard = function (event, cardId) {
        event.stopPropagation();
        $scope.deck.addCardToSideBoard(cardId);
        $scope.totalCardCount = $scope.deck.getCardCount();
    };

    $scope.dropCardFromSideBoard = function (event, cardId) {
        event.stopPropagation();
        $scope.deck.dropCardFromSideBoard(cardId);
        $scope.totalCardCount = $scope.deck.getCardCount();
    };

    $scope.dropAllFromSideboard = function (event, cardId) {
        event.stopPropagation();
        $scope.deck.dropAllFromSideboard(cardId);
        $scope.totalCardCount = $scope.deck.getCardCount();
    };

    $scope.moveCardToSideboard = function (event, cardId) {
        event.stopPropagation();
        $scope.deck.moveCardToSideboard(cardId);
        $scope.totalCardCount = $scope.deck.getCardCount();
    };

    $scope.moveCardToMain = function (event, cardId) {
        event.stopPropagation();
        $scope.deck.moveCardToMain(cardId);
        $scope.totalCardCount = $scope.deck.getCardCount();
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
        $scope.sampleHand = decks.getShuffleOfDeck($scope.deck.getId(), shuffleCount);
    };

    $scope.mulligan = function () {
        if (shuffleCount > 1) {
            shuffleCount = shuffleCount - 1;
            $scope.sampleHand = decks.getShuffleOfDeck($scope.deck.getId(), shuffleCount);
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
        each($scope.deckMeta.manaCurve, function (count, mana) {
            if (mana !== 'undefined') {
                $scope.manaCostData.labels.push('CMC ' + mana);
                dataSet.data.push(count);
            }
        });
        $scope.manaCostData.datasets.push(dataSet);
    };

};
