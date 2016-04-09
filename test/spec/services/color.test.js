import App from '../../../src/js/app';

describe.only('Service: cardColor', function () {

    const DEFAULT_COLOR_MAP = {
        W: false,
        B: false,
        G: false,
        U: false,
        R: false,
        C: false
    };

    let cardColor;

    beforeEach(angular.mock.module(App.name));
    beforeEach(angular.mock.inject(function (_cardColor_) {
        cardColor = _cardColor_;
    }));

    describe('getColorBitsForDb', () => {

        it('Should return correct color bits', function () {
            const colorBits = cardColor.getColorBitsForDb('{W}{U}');

            expect(colorBits).to.equal(3);
        });

        it('Should return 0 if no color is in the mana cost string', function () {
            const colorBits = cardColor.getColorBitsForDb('{2}{1}');

            expect(colorBits).to.equal(0);
        });

        it('Should return 0 mana cost string is null', function () {
            const colorBits = cardColor.getColorBitsForDb(null);

            expect(colorBits).to.equal(0);
        });

    });

    describe('getColorBitsFromMap', function () {

        it('Should return correct color bits', function () {
            const colorMapToCheck = _.assign({}, DEFAULT_COLOR_MAP, { W: true, U: true }),
                colorBits = cardColor.getColorBitsFromMap(colorMapToCheck);

            expect(colorBits).to.equal(3);
        });

        it('Should return 0 if every color is false', function () {
            const colorBits = cardColor.getColorBitsFromMap(DEFAULT_COLOR_MAP);

            expect(colorBits).to.equal(0);
        });
    });

});
