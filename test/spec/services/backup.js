'use strict';

describe('Service: backup', function () {

  var backup, cards;

  beforeEach(module('mtgApp'));
  beforeEach(inject(function (_backup_, _cards_) {
    backup = _backup_;
    cards = _cards_;
    cards.db.insert(cardsExcerpt);
  }));

  describe('backup.getImportData', function () {
    var data, oldData;

    beforeEach(function () {
      data = backup.getImportData(oldBackupSample);
      oldData = JSON.parse(oldBackupSample);
    });

    it('Should return well structured data to display meta info in UI', function () {
      expect(data.decks).not.toBeUndefined();
      expect(data.cards).not.toBeUndefined();
    });

    it('Should correct update data if it an old backup', function () {
      var firstCardNew = cards.db({id: data.cards[0].id}).get(),
        firstCardOld = cards.db({multiverseid: Number(oldData.cards[0].multiverseid)}).get();

      expect(firstCardOld[0]).toEqual(firstCardNew[0]);
    });

    it('Should keep count of cards', function () {
      expect(data.cards[0].count).toBe(oldData.cards[0].count);
      expect(data.cards[1].count).toBe(oldData.cards[1].count);
    });

    it('Should return `false` if parsing fails', function () {
      expect(backup.getImportData({})).toBe(false);
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

      expect(internalDecks.length).toBe(_.size(data.decks));
      expect(internalOwnCards.length).toBe(data.cards.length);
    });

    it('Should import `cards` only', function () {
      var internalOwnCards, internalDecks,
        dataWithOutDecks = _.assign({}, {cards: data.cards});

      ownCards.clear();
      decks.removeAll();
      backup.importData(dataWithOutDecks);
      internalOwnCards = ownCards.getAll();
      internalDecks = decks.getAll();

      expect(internalOwnCards.length).toBe(data.cards.length);
      expect(internalDecks.length).toBe(0);
    });
  });
});
