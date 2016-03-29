import App from '../../../src/js/app';
import {size} from 'lodash';

describe('Service: backup', () => {

    var backup, cards;

    beforeEach(angular.mock.module(App.name));
    beforeEach(angular.mock.inject((_backup_, _cards_) => {
        backup = _backup_;
        cards = _cards_;
        cards.db.insert(cardsExcerpt);
    }));

    afterEach(() => {
        window.localStorage.clear();
    });

    describe('backup.getImportData', () => {
        let data, oldData;

        beforeEach(() => {
            data = backup.getImportData(oldBackupSample);
            oldData = JSON.parse(oldBackupSample);
        });

        it('Should return well structured data to display meta info in UI', () => {
            expect(data.decks).to.not.be.undefined;
            expect(data.cards).to.not.be.undefined;
        });

        it('Should correct update data if it an old backup', () => {
            let firstCardNew = cards.db({ id: data.cards[0].id }).get(),
                firstCardOld = cards.db({ multiverseid: Number(oldData.cards[0].multiverseid) }).get();

            expect(firstCardOld[0]).to.deep.equal(firstCardNew[0]);
        });

        it('Should keep count of cards', () => {
            expect(data.cards[0].count).to.equal(oldData.cards[0].count);
            expect(data.cards[1].count).to.equal(oldData.cards[1].count);
        });

        it('Should return `false` if parsing fails', () => {
            expect(backup.getImportData({})).to.be.false;
        });

    });

    describe('backup.importData', () => {
        var data, decks, ownCards;
        beforeEach(inject((_decks_, _ownCards_) => {
            decks = _decks_;
            ownCards = _ownCards_;
            data = backup.getImportData(oldBackupSample);
        }));

        it('Should correct import data', () => {
            var internalDecks, internalOwnCards;
            backup.importData(data);
            internalDecks = decks.getAll();
            internalOwnCards = ownCards.getAll();

            expect(internalDecks.size).to.equal(size(data.decks));
            expect(internalOwnCards).to.have.lengthOf(data.cards.length);
        });

        it('Should import `cards` only', () => {
            var internalOwnCards, internalDecks,
                dataWithOutDecks = _.assign({}, { cards: data.cards });

            ownCards.clear();
            decks.removeAll();
            backup.importData(dataWithOutDecks);
            internalOwnCards = ownCards.getAll();
            internalDecks = decks.getAll();

            expect(internalOwnCards).to.have.lengthOf(data.cards.length);
            expect(internalDecks.size).to.equal(0);
        });
    });
});
