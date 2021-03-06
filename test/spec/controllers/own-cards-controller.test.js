import App from '../../../src/js/app';
import {range, map} from 'lodash';

describe('Controller: OwnCardsController', function () {
    let scope, ownCards, cards, modal;

    beforeEach(angular.mock.module(App.name));
    beforeEach(angular.mock.inject(function ($controller, $rootScope, $uibModal, _ownCards_, _cards_) {
        scope = $rootScope.$new();
        scope.cardId = 23;
        ownCards = _ownCards_;
        cards = _cards_;
        sinon.stub(cards, 'filter').returns(
            map(range(100), function (value) {
                return { multiverseid: value };
            }));
        modal = $uibModal;
        $controller('OwnCardsController', {
            $scope: scope,
            ownCards: ownCards,
            $modal: modal
        });
    }));

    it('should have correct initial values', function () {
        expect(scope.db).to.not.be.undefined;
        expect(scope.filteredCards).to.have.length(0);
        expect(scope.maxResultLength).to.equal(20);
        expect(scope.currentPage).to.equal(1);
        expect(scope.cards).to.have.length(0);
        expect(scope.totalItems).to.equal(0);
        expect(scope.filterCollapsed).to.be.true;
    });

    it('change scope.currentPage should update scope.cards and scope.totalItems', function () {
        scope.$apply();
        expect(scope.totalItems).to.equal(0);
        scope.filteredCards = scope.db().get();
        scope.currentPage = 2;
        scope.$apply();
        expect(scope.totalItems).to.equal(100);
        expect(scope.cards).to.have.length(scope.maxResultLength);
        expect(scope.cards[0].multiverseid).to.equal(20);
    });

    it('change scope.maxResultLength should update scope.cards', function () {
        scope.$apply();
        scope.filteredCards = scope.db().get();
        scope.maxResultLength = 23;
        scope.$apply();
        expect(scope.cards).to.have.length(23);
        expect(scope.cards[0].multiverseid).to.equal(0);
    });

    it('change scope.filterUpdateTimeStamp should update scope.cards', function () {
        scope.$apply();
        scope.filteredCards = scope.db().get();
        scope.filterUpdateTimeStamp = new Date().getTime();
        scope.currentPage = 4;
        scope.$apply();
        expect(scope.cards).to.have.length(20);
        expect(scope.cards[0].multiverseid).to.equal(60);
    });

    it('scope.showCardModal should call modal.open', function () {
        sinon.stub(modal, 'open');
        scope.showCardModal();
        expect(modal.open).to.have.been.called;
        modal.open.restore();
    });
});
