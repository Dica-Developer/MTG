import App from '../../../src/js/app';

describe('Controller: BackupLoadController', function () {
    let controller, scope, modalInstance,
        cards = {},
        importDecks = [
            {
                name: 'test Deck 1',
                id: '1'
            },
            {
                name: 'test Deck 2',
                id: '2'
            },
            {
                name: 'test Deck 3',
                id: '3'
            }
        ],
        decks = sinon.stub({
            'existsByName': function () {
            }
        });

    beforeEach(angular.mock.module(App.name));
    beforeEach(angular.mock.inject(function ($controller, $rootScope) {
        controller = $controller;
        scope = $rootScope.$new();
        modalInstance = sinon.stub({
            'close': function () {
            }, 'dismiss': function () {
            }
        });
    }));

    it('Should set decks correct values', function () {
        controller('BackupLoadController', {
            $scope: scope,
            $uibModalInstance: modalInstance,
            decks: decks,
            importCards: cards,
            importDecks: importDecks
        });

        expect(scope.decks).to.have.length(3);
        Object.keys(scope.decks).forEach(function (deck) {
            expect(scope.decks[deck].selected).to.be.true;
        });
    });

    it('$scope.deselectAll should set "selected" to all decks false', function () {
        controller('BackupLoadController', {
            $scope: scope,
            $uibModalInstance: modalInstance,
            importCards: cards,
            importDecks: importDecks
        });
        scope.deselectAll();
        Object.keys(scope.decks).forEach(function (deck) {
            expect(scope.decks[deck].selected).to.be.false;
        });
    });

    it('$scope.selectAll should set "selected" to all decks true', function () {
        controller('BackupLoadController', {
            $scope: scope,
            $uibModalInstance: modalInstance,
            importCards: cards,
            importDecks: importDecks
        });
        scope.deselectAll();
        Object.keys(scope.decks).forEach(function (deck) {
            expect(scope.decks[deck].selected).to.be.false;
        });

        scope.selectAll();
        Object.keys(scope.decks).forEach(function (deck) {
            expect(scope.decks[deck].selected).to.be.true;
        });
    });

    it('$scope.decksToImport should return correct length of all set with "selected = true"', function () {
        controller('BackupLoadController', {
            $scope: scope,
            $uibModalInstance: modalInstance,
            importCards: cards,
            importDecks: importDecks
        });

        expect(scope.decksToImport()).to.equal(3);

        scope.decks[0].selected = false;
        expect(scope.decksToImport()).to.equal(2);
    });

    it('$scope.ok should call $uibModalInstance.close', function () {
        controller('BackupLoadController', {
            $scope: scope,
            $uibModalInstance: modalInstance,
            importCards: cards,
            importDecks: importDecks
        });
        scope.ok();
        expect(modalInstance.close).to.have.been.called;
    });

    it('$scope.cancel should call $uibModalInstance.dismiss', function () {
        controller('BackupLoadController', {
            $scope: scope,
            $uibModalInstance: modalInstance,
            importCards: cards,
            importDecks: importDecks
        });
        scope.cancel();
        expect(modalInstance.dismiss).to.have.been.called;
    });
});
