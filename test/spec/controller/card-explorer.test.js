import App from '../../../src/js/app';
import {range, map} from 'lodash';

describe('Controller: CardExplorerController', function () {
    let scope, cards, modal;

    beforeEach(angular.mock.module(App.name));
    beforeEach(angular.mock.inject(function ($controller, $rootScope, $uibModal, _cards_) {
        scope = $rootScope.$new();
        modal = $uibModal;
        cards = _cards_;

        scope.cardId = 23;
        cards.db.insert(
            map(range(100), function (value) {
                return { multiverseid: value };
            }));
        $controller('CardExplorerController', {
            $scope: scope,
            cards: cards,
            $modal: modal
        });
    }));

    it('should have correct initial values', function () {
        expect(scope.db).to.not.be.undefined;
        expect(scope.filteredCards.length).to.equal(0);
        expect(scope.maxResultLength).to.equal(20);
        expect(scope.currentPage).to.equal(1);
        expect(scope.cards.length).to.equal(0);
        expect(scope.totalItems).to.equal(0);
        expect(scope.filterCollapsed).to.ok;
    });

    it('change scope.currentPage should update scope.cards and scope.totalItems', function () {
        scope.$apply();
        expect(scope.totalItems).to.equal(0);
        scope.filteredCards = scope.db().get();
        scope.currentPage = 2;
        scope.$apply();
        expect(scope.totalItems).to.equal(100);
        expect(scope.cards.length).to.equal(scope.maxResultLength);
        expect(scope.cards[0].multiverseid).to.equal(20);
    });

    it('change scope.maxResultLength should update scope.cards', function () {
        scope.$apply();
        scope.filteredCards = scope.db().get();
        scope.maxResultLength = 23;
        scope.$apply();
        expect(scope.cards.length).to.equal(23);
        expect(scope.cards[0].multiverseid).to.equal(0);
    });

    it('change scope.filterUpdateTimeStamp should update scope.cards', function () {
        scope.$apply();
        scope.filteredCards = scope.db().get();
        scope.filterUpdateTimeStamp = new Date().getTime();
        scope.currentPage = 4;
        scope.$apply();
        expect(scope.cards.length).to.equal(20);
        expect(scope.cards[0].multiverseid).to.equal(60);
    });

    it('scope.showCardModal should call modal.open', function () {
        sinon.spy(modal, 'open');
        scope.showCardModal();
        expect(modal.open).to.have.been.called;
        modal.open.restore();
    });
});
