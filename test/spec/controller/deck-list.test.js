import App from '../../../src/js/app';

describe('Controller: DeckListController', function () {
    let state, scope, decks, event;

    beforeEach(angular.mock.module(App.name));
    beforeEach(angular.mock.inject(function ($controller, $rootScope, _decks_) {
        scope = $rootScope.$new();
        decks = _decks_;
        state = {
            go: function () {
            }
        };
        $controller('DeckListController', {
            $scope: scope,
            decks: decks,
            $state: state
        });
        event = sinon.stub({
            'preventDefault': function () {
            }, 'stopImmediatePropagation': function () {
            }
        });
    }));

    it('$scope.addNew should call decks.addNew() and $state.go', function () {
        sinon.spy(decks, 'addNew');
        sinon.stub(state, 'go');
        scope.addDeck();
        expect(decks.addNew).to.have.been.called;
        expect(state.go).to.have.been.called;
        expect(state.go).to.have.been.calledWith('deck-builder');
        decks.addNew.restore();
        state.go.restore();
    });

    it('$scope.removeDeck should call decks.removeDeck() with correct id', function () {
        sinon.spy(decks, 'removeDeck');
        var deck = decks.addNew();
        scope.removeDeck(event, deck.options.id);
        expect(decks.removeDeck).to.have.been.calledWith(deck.options.id);
        expect(event.stopImmediatePropagation).to.have.been.called;
        expect(event.preventDefault).to.have.been.called;
        decks.removeDeck.restore();
    });

    it('decks.getAll should called if a deck is removed', function () {
        sinon.spy(decks, 'getAll');
        var deck = decks.addNew();
        scope.removeDeck(event, deck.options.id);
        scope.$digest();
        expect(decks.getAll).to.have.been.called;
        decks.getAll.restore();
    });
});
