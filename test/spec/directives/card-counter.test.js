import App from '../../../src/js/app';

describe('Directive: cardCounter', function () {
    let compile, scope, cards, ownCards;

    beforeEach(angular.mock.module(App.name));
    beforeEach(angular.mock.inject(function ($compile, $rootScope, _ownCards_, _cards_) {
        compile = $compile;
        scope = $rootScope.$new();
        cards = _cards_;
        ownCards = _ownCards_;

        cards.db.insert(cardsExcerpt);
    }));

    afterEach(function () {
        window.localStorage.clear();
    });

    it('Should display correct amount of own cards', function () {
        scope.multiverseid = 279;
        var element = compile('<card-counter x-card-id="{{multiverseid}}" ></card-counter>')(scope);
        scope.$digest();
        expect(element.find('span').eq(1).text()).to.equal('0');

        ownCards.addCard('279');

        scope.$digest();
        expect(element.find('span').eq(1).text()).to.equal('1');

        ownCards.removeCard('279');

        scope.$digest();
        expect(element.find('span').eq(1).text()).to.equal('0');
    });
});

