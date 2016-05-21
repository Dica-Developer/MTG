import App from '../../../src/js/app.js';

describe('Controller: CardCounterController', function () {
    let controller, scope, ownCards, event;

    beforeEach(angular.mock.module(App.name));
    beforeEach(angular.mock.inject(function ($controller, $rootScope) {
        controller = $controller;
        scope = $rootScope.$new();
        scope.cardId = 23;
        ownCards = sinon.stub({
            'getCountOf': () => {},
            'addCard': () => {},
            'removeCard': () => {}
        });
        controller('CardCounterController', {
            $scope: scope,
            ownCards: ownCards
        });
        event = sinon.stub({
            'preventDefault': () => {},
            'stopImmediatePropagation': () => {}
        });
    }));

    it('scope.addCard should prevent default event and call ownCards.addCard', function () {
        scope.addCard(event);
        expect(ownCards.addCard).to.have.been.calledWith(23);
        expect(event.preventDefault).to.have.been.called;
        expect(event.stopImmediatePropagation).to.have.been.called;
    });

    it('scope.removeCard should prevent default event and call ownCards.removeCard', function () {
        scope.count = 1;
        scope.removeCard(event);
        expect(ownCards.removeCard).to.have.been.calledWith(23);
        expect(event.preventDefault).to.have.been.called;
        expect(event.stopImmediatePropagation).to.have.been.called;
    });

    it('scope.removeCard shouldn\'t call ownCards.removeCard if card count is 0', function () {
        scope.removeCard(event);
        expect(ownCards.removeCard).to.not.have.been.called;
        expect(event.preventDefault).to.have.been.called;
        expect(event.stopImmediatePropagation).to.have.been.called;
    });

    it('scope.count should update if ownCards.getCountOf return changed value', function () {
        scope.$apply();
        ownCards.getCountOf.returns(2);
        scope.$apply();
        expect(scope.count).to.equal(2);
    });

    it('ownCards.getCountOf should called if scope.cardId changes', function () {
        scope.$apply();
        expect(scope.cardId).to.equal(23);
        expect(ownCards.getCountOf).to.have.been.calledWith(23);
        scope.cardId = 66;
        scope.$apply();
        expect(ownCards.getCountOf).to.have.been.calledWith(66);
    });
});
