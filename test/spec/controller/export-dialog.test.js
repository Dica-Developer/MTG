import App from '../../../src/js/app';

describe('Controller: ExportDialogController', function () {
    let controller, scope, modalInstance,
        cards = {},
        decks = [
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
        ];

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
        controller('ExportDialogController', {
            $scope: scope,
            $uibModalInstance: modalInstance,
            exportCards: cards,
            exportDecks: decks
        });

        expect(scope.decks).to.have.length(3);
        Object.keys(scope.decks).forEach(function (deck) {
            expect(scope.decks[deck].selected).to.be.true;
        });
    });

    it('Should set decks to null', function () {
        controller('ExportDialogController', {
            $scope: scope,
            $uibModalInstance: modalInstance,
            exportCards: cards,
            exportDecks: void 0
        });

        expect(scope.decks).to.be.null;
    });

    it('$scope.toggleSelected should set "selected" to all decks false', function () {
        controller('ExportDialogController', {
            $scope: scope,
            $uibModalInstance: modalInstance,
            exportCards: cards,
            exportDecks: decks
        });
        scope.toggleSelected(false);
        Object.keys(scope.decks).forEach(function (deck) {
            expect(scope.decks[deck].selected).to.be.false;
        });
    });

    it('$scope.toggleSelected should set "selected" to all decks true', function () {
        controller('ExportDialogController', {
            $scope: scope,
            $uibModalInstance: modalInstance,
            exportCards: cards,
            exportDecks: decks
        });
        scope.toggleSelected(false);
        Object.keys(scope.decks).forEach(function (deck) {
            expect(scope.decks[deck].selected).to.be.false;
        });

        scope.toggleSelected(true);
        Object.keys(scope.decks).forEach(function (deck) {
            expect(scope.decks[deck].selected).to.be.true;
        });
    });

    it('$scope.decksToExport should return correct length of all set with "selected = true"', function () {
        controller('ExportDialogController', {
            $scope: scope,
            $uibModalInstance: modalInstance,
            exportCards: cards,
            exportDecks: decks
        });
        expect(scope.decksToExport()).to.equal(3);

        scope.decks[0].selected = false;
        expect(scope.decksToExport()).to.equal(2);
    });

    it('$scope.ok should call $uibModalInstance.close', function () {
        controller('ExportDialogController', {
            $scope: scope,
            $uibModalInstance: modalInstance,
            exportCards: cards,
            exportDecks: decks
        });
        scope.ok();
        expect(modalInstance.close).to.have.been.called;
    });

    it('$scope.cancel should call $uibModalInstance.dismiss', function () {
        controller('ExportDialogController', {
            $scope: scope,
            $uibModalInstance: modalInstance,
            exportCards: cards,
            exportDecks: decks
        });
        scope.cancel();
        expect(modalInstance.dismiss).to.have.been.called;
    });
});
