import App from '../../../src/js/app';

describe('Service: backup', function () {

    var backup, cards;

    beforeEach(angular.mock.module(App.name));
    beforeEach(angular.mock.inject(function (_backup_, _cards_) {
        backup = _backup_;
        cards = _cards_;
        cards.db.insert(cardsExcerpt);
    }));

    afterEach(function () {
        window.localStorage.clear();
    });

    describe('backup.getImportData', function () {
        var data, oldData;

        beforeEach(function () {
            data = backup.getImportData(oldBackupSample);
            oldData = JSON.parse(oldBackupSample);
        });

        it('Should return well structured data to display meta info in UI', function () {
            expect(data.decks).to.not.be.undefined;
            expect(data.cards).to.not.be.undefined;
        });

        it('Should correct update data if it an old backup', function () {
            var firstCardNew = cards.db({ id: data.cards[0].id }).get(),
                firstCardOld = cards.db({ multiverseid: Number(oldData.cards[0].multiverseid) }).get();

            expect(firstCardOld[0]).to.deep.equal(firstCardNew[0]);
        });

        it('Should keep count of cards', function () {
            expect(data.cards[0].count).to.equal(oldData.cards[0].count);
            expect(data.cards[1].count).to.equal(oldData.cards[1].count);
        });

        it('Should return `false` if parsing fails', function () {
            expect(backup.getImportData({})).to.be.false;
        });

    });

    describe('backup.importData', function () {
        var data, decks, ownCards;
        beforeEach(inject(function (_decks_, _ownCards_) {
            decks = _decks_;
            ownCards = _ownCards_;
            data = backup.getImportData(oldBackupSample);
        }));

        it('Should correct import data', function () {
            var internalDecks, internalOwnCards;
            backup.importData(data);
            internalDecks = decks.getAll();
            internalOwnCards = ownCards.getAll();

            expect(internalDecks).to.have.length(_.size(data.decks));
            expect(internalOwnCards).to.have.length(data.cards.length);
        });

        it('Should import `cards` only', function () {
            var internalOwnCards, internalDecks,
                dataWithOutDecks = _.assign({}, { cards: data.cards });

            ownCards.clear();
            decks.removeAll();
            backup.importData(dataWithOutDecks);
            internalOwnCards = ownCards.getAll();
            internalDecks = decks.getAll();

            expect(internalOwnCards).to.have.length(data.cards.length);
            expect(internalDecks).to.have.length(0);
        });
    });
});
