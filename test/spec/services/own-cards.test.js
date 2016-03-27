import App from '../../../src/js/app';

describe('Service: ownCards', function () {
    let ownCards, cards, localStorageService, clock;

    beforeEach(angular.mock.module(App.name));
    beforeEach(angular.mock.inject(function ($timeout, _ownCards_, _cards_, _localStorageService_) {
        clock = sinon.useFakeTimers();
        cards = _cards_;
        cards.db.insert(cardsExcerpt);
        localStorageService = _localStorageService_;
        ownCards = _ownCards_;
        sinon.spy(localStorageService, 'set');
    }));

    afterEach(function () {
        clock.restore();
        localStorageService.set.restore();
        window.localStorage.clear();
    });

    it('should have correct API', function () {
        expect(ownCards.getAll).to.not.be.undefined;
        expect(ownCards.getById).to.not.be.undefined;
        expect(ownCards.getCountOf).to.not.be.undefined;
        expect(ownCards.addCard).to.not.be.undefined;
        expect(ownCards.removeCard).to.not.be.undefined;
        expect(ownCards.importData).to.not.be.undefined;
    });

    xit('.addCard should call localStorageService.set after 1000ms', function () {
        var card = cardsExcerpt[0];

        ownCards.addCard(card.multiverseid);
        expect(localStorageService.set).to.not.have.been.called;


        clock.tick(800);
        expect(localStorageService.set).to.not.have.been.called;

        clock.tick(201);
        expect(localStorageService.set).to.have.been.called;

        ownCards.addCard(card.multiverseid);
        clock.tick(1001);
        expect(localStorageService.set).to.have.been.calledTwice;
    });

    it('.addCard should set correct card count', function () {
        var card = cardsExcerpt[0];

        expect(ownCards.getCountOf(card.multiverseid)).to.equal(0);

        ownCards.addCard(card.multiverseid);
        expect(ownCards.getCountOf(card.multiverseid)).to.equal(1);

        ownCards.addCard(card.multiverseid);
        expect(ownCards.getCountOf(card.multiverseid)).to.equal(2);
    });

    xit('.removeCard should call localStorageService.set after 1000ms', function () {
        var card = cardsExcerpt[0];
        ownCards.addCard(card.multiverseid);
        clock.tick(1001);
        localStorageService.set.calls.reset();

        ownCards.removeCard(card.multiverseid);
        expect(localStorageService.set).not.toHaveBeenCalled();


        clock.tick(800);
        expect(localStorageService.set).not.toHaveBeenCalled();

        clock.tick(201);
        expect(localStorageService.set).toHaveBeenCalled();
    });

    it('.removeCard should set correct card count', function () {
        var card = cardsExcerpt[0];
        ownCards.addCard(card.multiverseid);
        ownCards.addCard(card.multiverseid);
        ownCards.addCard(card.multiverseid);

        ownCards.removeCard(1);
        expect(ownCards.getCountOf(card.multiverseid)).to.equal(3);

        ownCards.removeCard(card.multiverseid);
        expect(ownCards.getCountOf(card.multiverseid)).to.equal(2);

        ownCards.removeCard(card.multiverseid);
        expect(ownCards.getCountOf(card.multiverseid)).to.equal(1);

        ownCards.removeCard(card.multiverseid);
        expect(ownCards.getCountOf(card.multiverseid)).to.equal(0);
    });

    it('.getById should return correct card entry', function () {
        var card = cardsExcerpt[0];
        var ownCard = ownCards.getById(card.id);

        expect(ownCard).to.be.undefined;

        ownCards.addCard(card.id);

        ownCard = ownCards.getById(card.id);
        expect(ownCard.id).to.equal(card.id);
    });

});
