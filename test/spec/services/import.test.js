import App from '../../../src/js/app';
import {size, each, filter} from 'lodash';

describe.only('Service: import', function () {
    let decks, cards, Importer;

    beforeEach(angular.mock.module(App.name));
    beforeEach(angular.mock.inject(function (_decks_, _cards_, _Importer_) {
        cards = _cards_;
        // cards.db.insert(cardsExcerpt);
        decks = _decks_;
        Importer = _Importer_;
    }));

    afterEach(function () {
        decks.removeAll();
    });

    describe('Importer: MTG', () => {

        describe('parseMtgFile', () => {

            it('Should return correct parsed object', () => {
                const splittedFile = MTG_SAMPLE.split(/\r?\n/),
                    result = Importer.parseMtgFile(splittedFile);

                expect(result).to.have.lengthOf(36);
            });

            it('Should return correct number of main board cards', () => {
                const splittedFile = MTG_SAMPLE.split(/\r?\n/),
                    result = Importer.parseMtgFile(splittedFile),
                    mainBoard = filter(result, {sideboard: false});

                expect(mainBoard).to.have.lengthOf(25);
            });

        });

    });

});
