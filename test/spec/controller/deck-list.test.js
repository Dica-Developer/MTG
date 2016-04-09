import App from '../../../src/js/app';

describe('Controller: DeckListController', function () {
    let state, scope, decks, event, deck1;

    beforeEach(angular.mock.module(App.name));
    beforeEach(angular.mock.inject(function ($controller, $rootScope, _decks_) {
        scope = $rootScope.$new();
        decks = _decks_;

        deck1 = decks.addNew();
        decks.addNew();
        decks.addNew();

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

    it('$scope.removeDeck should update the deck list', function (done) {

        scope.$apply();
        expect(scope.deckList).to.have.lengthOf(3);
        setTimeout(function(){
            scope.removeDeck(event, deck1.getId());
            scope.$apply();
            expect(scope.deckList).to.have.lengthOf(2);
            done();
        }, 100);
    });
});
