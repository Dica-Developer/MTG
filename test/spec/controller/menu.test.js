import App from '../../../src/js/app';

describe('Controller: MenuController', function () {
    let scope, lastChanged,
        deckMock = [1, 2, 3];

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
        expect(scope.allDecks).to.have.length(3);
    });

    it('should update list if decks.lastChanged is changed', function () {
        expect(scope.allDecks).to.have.length(3);
        deckMock = [1, 2];
        lastChanged = new Date().getTime();
        scope.$apply();

        expect(scope.allDecks).to.have.length(2);

    });
});
