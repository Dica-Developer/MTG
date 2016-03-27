import App from '../../../src/js/app';

describe('Controller: CardCounterController', function () {
    let controller, scope, ownCards, event;

    beforeEach(angular.mock.module(App.name));
    beforeEach(angular.mock.inject(function ($controller, $rootScope, _ownCards_) {
        controller = $controller;
        scope = $rootScope.$new();
        scope.cardId = 23;
        ownCards = _ownCards_;
        controller('CardCounterController', {
            $scope: scope,
            ownCards: ownCards
        });
        event = sinon.stub({
            'preventDefault': function () {},
            'stopImmediatePropagation': function () {}
        });
    }));

    it('should have correct initial values', function () {
        expect(scope.count).to.equal(0);
    });

    it('scope.addCard should prevent default event and call ownCards.addCard', function () {
        sinon.spy(ownCards, 'addCard');
        scope.addCard(event);
        expect(ownCards.addCard).to.have.been.calledWith(23);
        expect(event.preventDefault).to.have.been.called;
        expect(event.stopImmediatePropagation).to.have.been.called;
        ownCards.addCard.restore();
    });

    it('scope.removeCard should prevent default event and call ownCards.removeCard', function () {
        sinon.spy(ownCards, 'removeCard');
        scope.count = 1;
        scope.removeCard(event);
        expect(ownCards.removeCard).to.have.been.calledWith(23);
        expect(event.preventDefault).to.have.been.called;
        expect(event.stopImmediatePropagation).to.have.been.called;
        ownCards.removeCard.restore();
    });

    it('scope.removeCard shouldn\'t call ownCards.removeCard if card count is 0', function () {
        sinon.spy(ownCards, 'removeCard');
        scope.removeCard(event);
        expect(ownCards.removeCard).to.not.have.been.called;
        expect(event.preventDefault).to.have.been.called;
        expect(event.stopImmediatePropagation).to.have.been.called;
        ownCards.removeCard.restore();
    });

    it('scope.count should update if ownCards.getCountOf return changed value', function () {
        scope.$apply();
        expect(scope.count).to.equal(0);
        sinon.stub(ownCards, 'getCountOf').returns(2);
        scope.$apply();
        expect(scope.count).to.equal(2);
        ownCards.getCountOf.restore();
    });

    it('ownCards.getCountOf should called if scope.cardId changes', function () {
        sinon.spy(ownCards, 'getCountOf');
        scope.$apply();
        expect(scope.cardId).to.equal(23);
        expect(ownCards.getCountOf).to.have.been.calledWith(23);
        scope.cardId = 66;
        scope.$apply();
        expect(ownCards.getCountOf).to.have.been.calledWith(66);
        ownCards.getCountOf.restore();
    });
});
