import App from '../../../src/js/app';
import {range} from 'lodash';

describe('Controller: DeckBuilderController', function () {
    var scope, ownCards, decks, cards, fakeEvent, newDeck;

    beforeEach(angular.mock.module(App.name));
    beforeEach(angular.mock.inject(function ($controller, $rootScope, _ownCards_, _decks_, _cards_) {
        scope = $rootScope.$new();
        ownCards = _ownCards_;
        decks = _decks_;
        cards = _cards_;
        cards.db.insert(cardsExcerpt);

        newDeck = decks.addNew();

        $controller('DeckBuilderController', {
            $scope: scope,
            ownCards: ownCards,
            decks: decks,
            cards: cards,
            $stateParams: {
                deckId: newDeck.options.id
            }
        });
        fakeEvent = sinon.stub({
            'preventDefault': function () {
            }, 'stopPropagation': function () {
            }
        });
    }));

    afterEach(function () {
        window.localStorage.clear();
    });

    it('should have correct initial values', function () {
        expect(scope.scope).to.deep.equal(scope);
        expect(scope.db).to.deep.equal(cards.db);
        expect(scope.ownCards).to.deep.equal(ownCards);
        expect(scope.deck).to.deep.equal(newDeck);
        expect(scope.cards).to.have.lengthOf(0);
        expect(scope.saveDeck).to.be.a('Function');
        expect(scope.totalCardCount).to.equal(0);
        expect(scope.sampleHand).to.deep.equal([]);
        expect(scope.typeFilter).to.equal('');
        expect(scope.orderPredicate).to.equal('types');
        expect(scope.orderReverse).to.be.false;
        expect(scope.sideboard).to.have.lengthOf(0);
        expect(scope.editname).to.be.false;
    });

    it('$scope.editName should set $scope.editname to "true"', function () {
        expect(scope.editname).to.be.false;
        scope.editName();
        expect(scope.editname).to.be.true;
    });

    it('$scope.saveName should call $scope.saveDeck and set $scope.editname to "false"', function () {
        sinon.spy(scope, 'saveDeck');
        expect(scope.editname).to.be.false;
        scope.editName();
        expect(scope.editname).to.be.true;
        scope.saveName();
        expect(scope.editname).to.be.false;
        expect(scope.saveDeck).to.have.been.called;
        scope.saveDeck.restore();
    });

    describe('Card actions', function () {

        it('$scope.addCard should call $scope.deck.addCard and update $scope.totalCardCount', function () {
            sinon.spy(newDeck, 'addCard');
            expect(scope.totalCardCount).to.equal(0);
            scope.addCard(fakeEvent, cardsExcerpt[0].id);

            expect(fakeEvent.stopPropagation).to.have.been.called;
            expect(newDeck.addCard).to.have.been.calledWith(cardsExcerpt[0].id);
            expect(scope.totalCardCount).to.equal(1);
            newDeck.addCard.restore();
        });

        it('$scope.dropCard should call $scope.deck.dropCard and update $scope.totalCardCount', function () {
            scope.addCard(fakeEvent, cardsExcerpt[0].id);
            sinon.spy(newDeck, 'dropCard');
            expect(scope.totalCardCount).to.equal(1);
            scope.dropCard(fakeEvent, cardsExcerpt[0].id);

            expect(fakeEvent.stopPropagation).to.have.been.called;
            expect(newDeck.dropCard).to.have.been.calledWith(cardsExcerpt[0].id);
            expect(scope.totalCardCount).to.equal(0);
            newDeck.dropCard.restore();
        });

        it('$scope.dropAll should call $scope.deck.dropAll and update $scope.totalCardCount', function () {
            scope.addCard(fakeEvent, cardsExcerpt[0].id);
            scope.addCard(fakeEvent, cardsExcerpt[0].id);
            sinon.spy(newDeck, 'dropAll');
            expect(scope.totalCardCount).to.equal(2);
            scope.dropAll(fakeEvent, cardsExcerpt[0].id);

            expect(fakeEvent.stopPropagation).to.have.been.called;
            expect(newDeck.dropAll).to.have.been.calledWith(cardsExcerpt[0].id);
            expect(scope.totalCardCount).to.equal(0);
            newDeck.dropAll.restore();
        });

        it('$scope.addCardToSideBoard should call $scope.deck.addCardToSideBoard', function () {
            sinon.spy(newDeck, 'addCardToSideBoard');
            scope.addCardToSideBoard(fakeEvent, cardsExcerpt[0].id);

            expect(fakeEvent.stopPropagation).to.have.been.called;
            expect(newDeck.addCardToSideBoard).to.have.been.calledWith(cardsExcerpt[0].id);
            newDeck.addCardToSideBoard.restore();
        });

        it('$scope.dropCardFromSideBoard should call $scope.deck.dropCardFromSideBoard', function () {
            sinon.spy(newDeck, 'dropCardFromSideBoard');
            scope.dropCardFromSideBoard(fakeEvent, cardsExcerpt[0].id);

            expect(fakeEvent.stopPropagation).to.have.been.called;
            expect(newDeck.dropCardFromSideBoard).to.have.been.calledWith(cardsExcerpt[0].id);
            newDeck.dropCardFromSideBoard.restore();
        });

        it('$scope.dropAllFromSideboard should call $scope.deck.dropAllFromSideboard', function () {
            sinon.spy(newDeck, 'dropAllFromSideboard');
            scope.dropAllFromSideboard(fakeEvent, cardsExcerpt[0].id);

            expect(fakeEvent.stopPropagation).to.have.been.called;
            expect(newDeck.dropAllFromSideboard).to.have.been.calledWith(cardsExcerpt[0].id);
            newDeck.dropAllFromSideboard.restore();
        });

        it('$scope.moveCardToSideboard should call $scope.deck.moveCardToSideboard', function () {
            sinon.spy(newDeck, 'moveCardToSideboard');
            scope.moveCardToSideboard(fakeEvent, cardsExcerpt[0].id);

            expect(fakeEvent.stopPropagation).to.have.been.called;
            expect(newDeck.moveCardToSideboard).to.have.been.calledWith(cardsExcerpt[0].id);
            newDeck.moveCardToSideboard.restore();
        });

        it('$scope.moveCardToMain should call $scope.deck.moveCardToMain', function () {
            sinon.spy(newDeck, 'moveCardToMain');
            scope.addCardToSideBoard(fakeEvent, cardsExcerpt[0].id);
            scope.moveCardToMain(fakeEvent, cardsExcerpt[0].id);

            expect(fakeEvent.stopPropagation).to.have.been.called;
            expect(newDeck.moveCardToMain).to.have.been.calledWith(cardsExcerpt[0].id);
            newDeck.moveCardToMain.restore();
        });
    });

    it('$scope.filterByType should set typeFilter to given type or to "" if type is already filter', function () {
        expect(scope.typeFilter).to.equal('');
        scope.filterByType('Instant');
        expect(scope.typeFilter).to.equal('Instant');
        scope.filterByType('Instant');
        expect(scope.typeFilter).to.equal('');
    });

    it('$scope.alreadyInDeck should return correctly whether is already in deck or not', function () {
        expect(scope.alreadyInDeck('93')).to.be.false;
        scope.addCard(fakeEvent, '93');
        expect(scope.alreadyInDeck('93')).to.be.true;
        scope.dropCard(fakeEvent, '93');
        expect(scope.alreadyInDeck('93')).to.be.false;
    });

    it('$scope.shuffle should set scope.sampleHand exact 7 cards', function () {
        range(1, 8).forEach((index) => {
            scope.addCard(fakeEvent, cardsExcerpt[index].id);
        });

        scope.shuffle();
        expect(scope.sampleHand).to.have.lengthOf(7);
    });

    it('$scope.mulligan should set scope.sampleHand one less with each call until 1', function () {
        range(1, 8).forEach((index) => {
            scope.addCard(fakeEvent, cardsExcerpt[index].id);
        });

        scope.shuffle();
        expect(scope.sampleHand).to.have.lengthOf(7);
        scope.mulligan();
        expect(scope.sampleHand).to.have.lengthOf(6);
        scope.mulligan();
        expect(scope.sampleHand).to.have.lengthOf(5);
        scope.mulligan();
        expect(scope.sampleHand).to.have.lengthOf(4);
        scope.mulligan();
        expect(scope.sampleHand).to.have.lengthOf(3);
        scope.mulligan();
        expect(scope.sampleHand).to.have.lengthOf(2);
        scope.mulligan();
        expect(scope.sampleHand).to.have.lengthOf(1);
        scope.mulligan();
        expect(scope.sampleHand).to.have.lengthOf(1);
    });

});
