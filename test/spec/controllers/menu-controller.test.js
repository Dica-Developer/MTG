import App from '../../../src/js/app';
import Deck from '../../../src/js/classes/Deck';

describe('Controller: MenuController', function () {
    let scope, lastChanged = new Date().getTime(),
        deckMock = [new Deck(), new Deck(), new Deck()];

    beforeEach(angular.mock.module(App.name));
    beforeEach(angular.mock.inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        $controller('MenuController', {
            $scope: scope,
            decks: {
                getAll: function () {
                    return deckMock;
                },
                lastChange: function () {
                    return lastChanged;
                }
            }
        });
    }));

    it('should attach a list of decks to scope', function () {
        expect(scope.allDecks).to.have.lengthOf(3);
    });

    it('should update list if decks.lastChanged is changed', function () {
        scope.$apply();
        expect(scope.allDecks).to.have.lengthOf(3);
        deckMock = [new Deck(), new Deck()];
        lastChanged = new Date().getTime();
        scope.$apply();

        expect(scope.allDecks).to.have.lengthOf(2);
    });
});
