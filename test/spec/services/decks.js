/*global cardsExcerpt, _*/
'use strict';

describe('Service: decks', function () {

  beforeEach(module('mtgApp'));

  var decks, cards, localStorageService;

  beforeEach(inject(function (_decks_, _cards_, _localStorageService_) {
    cards = _cards_;
    cards.db.insert(cardsExcerpt);
    decks = _decks_;
    localStorageService = _localStorageService_;
  }));

  describe('Deck', function () {
    var deck;
    beforeEach(function () {
      deck = decks.addNew();
    });

    it('Should be defined and have default values', function () {
      var options = deck.options;
      expect(deck).toBeDefined();

      expect(options.id).toBeDefined();
      expect(options.id).toEqual(jasmine.any(String));

      expect(options.name).toBeDefined();
      expect(options.name).toEqual(jasmine.any(String));
      expect(options.name).toBe('');

      expect(options.cards).toBeDefined();
      expect(options.cards).toEqual(jasmine.any(Array));
      expect(options.cards.length).toBe(0);

      expect(options.sideboard).toBeDefined();
      expect(options.sideboard).toEqual(jasmine.any(Array));
      expect(options.sideboard.length).toBe(0);

      expect(deck.cardsFull).toBeDefined();
      expect(deck.cardsFull).toEqual(jasmine.any(Array));
      expect(deck.cardsFull.length).toBe(0);

      expect(deck.sideboardFull).toBeDefined();
      expect(deck.sideboardFull).toEqual(jasmine.any(Array));
      expect(deck.sideboardFull.length).toBe(0);
    });

    it('deck.setName should add given name to deck.options', function () {
      var name = 'Awesome Deck';
      expect(deck.options.name).toBe('');

      deck.setName(name);
      expect(deck.options.name).toBe(name);
    });

    it('deck.getName should should return deck name', function () {
      var name = 'Awesome Deck';
      deck.options.name = name;
      expect(deck.getName()).toBe(name);
    });

    it('deck.setType should set tyoe to deck', function () {
      expect(deck.options.type).toBeUndefined();
      deck.setType('Commander');
      expect(deck.options.type).toBe('Commander');
    });

    it('deck.getColors should should an array with all colors used in the deck', function () {
      deck.addCard('9d91ef4896ab4c1a5611d4d06971fc8026dd2f3f');
      deck.addCard('d8b74ea7f050c8c05588e002f0264643fc90209b');
      var colors = deck.getColors();
      expect(colors).toEqual(['u', 'b']);
    });

    it('deck.getCountOf should return correct number of cards exist in deck with given id', function () {
      var card1 = cardsExcerpt[0];
      var card2 = cardsExcerpt[1];
      var card3 = cardsExcerpt[2];
      expect(deck.getCountOf(card1.multiverseid)).toBe(0);
      expect(deck.getCountOf(card2.multiverseid)).toBe(0);
      expect(deck.getCountOf(card3.multiverseid)).toBe(0);

      deck.addCard(card1.multiverseid);

      deck.addCard(card2.multiverseid);
      deck.addCard(card2.multiverseid);

      deck.addCard(card3.multiverseid);
      deck.addCard(card3.multiverseid);
      deck.addCard(card3.multiverseid);

      expect(deck.getCountOf(card1.multiverseid)).toBe(1);
      expect(deck.getCountOf(card2.multiverseid)).toBe(2);
      expect(deck.getCountOf(card3.multiverseid)).toBe(3);

    });

    it('deck.getSideboardCountOf should return correct number of cards exist in deck side board with given id', function () {
      var card1 = cardsExcerpt[0];
      var card2 = cardsExcerpt[1];
      var card3 = cardsExcerpt[2];
      expect(deck.getSideboardCountOf(card1.multiverseid)).toBe(0);
      expect(deck.getSideboardCountOf(card2.multiverseid)).toBe(0);
      expect(deck.getSideboardCountOf(card3.multiverseid)).toBe(0);

      deck.addCardToSideBoard(card1.multiverseid);

      deck.addCardToSideBoard(card2.multiverseid);
      deck.addCardToSideBoard(card2.multiverseid);

      deck.addCardToSideBoard(card3.multiverseid);
      deck.addCardToSideBoard(card3.multiverseid);
      deck.addCardToSideBoard(card3.multiverseid);

      expect(deck.getSideboardCountOf(card1.multiverseid)).toBe(1);
      expect(deck.getSideboardCountOf(card2.multiverseid)).toBe(2);
      expect(deck.getSideboardCountOf(card3.multiverseid)).toBe(3);

    });

    it('deck.getCardCount should return correct number of all cards in main deck', function () {
      var card1 = cardsExcerpt[0];
      expect(deck.getCardCount()).toBe(0);

      deck.addCard(card1.multiverseid);
      expect(deck.getCardCount()).toBe(1);

      deck.addCard(card1.multiverseid);
      expect(deck.getCardCount()).toBe(2);
    });

    it('deck.getSideboardCount should return correct number of all cards in side board', function () {
      var card1 = cardsExcerpt[0];
      expect(deck.getSideboardCount()).toBe(0);

      deck.addCardToSideBoard(card1.multiverseid);
      expect(deck.getSideboardCount()).toBe(1);

      deck.addCardToSideBoard(card1.multiverseid);
      expect(deck.getSideboardCount()).toBe(2);
    });

    it('deck.getCountByCardType should return correct number of all cards in side board sorted by card type', function () {
      var card1 = cardsExcerpt[0];
      var card2 = cardsExcerpt[1];
      expect(deck.getCountByCardType()).toEqual({});

      deck.addCard(card1.id);
      deck.addCard(card1.id);
      deck.addCard(card2.id);
      expect(deck.getCountByCardType()).toEqual({Creature: 2, Instant: 1});
    });

    describe('deck.addCard', function () {

      it('Should call .updateFullCardInfo', function () {
        var card = cardsExcerpt[0];
        spyOn(deck, 'updateFullCardInfo');
        deck.addCard(card.multiverseid);

        expect(deck.updateFullCardInfo).toHaveBeenCalled();
      });

      it('Should add card id to options.cards', function () {
        var card = cardsExcerpt[0];
        spyOn(deck, 'updateFullCardInfo');
        deck.addCard(card.multiverseid);

        expect(deck.options.cards.length).toBe(1);
        expect(deck.options.cards[0]).toBe(card.multiverseid);
      });

      it('Should add card id to options.cards also if card id already exist', function () {
        var card = cardsExcerpt[0];
        deck.addCard(card.multiverseid);
        spyOn(deck, 'updateFullCardInfo');

        deck.addCard(card.multiverseid);
        expect(deck.options.cards.length).toBe(2);
        expect(deck.options.cards[1]).toBe(card.multiverseid);
      });
    });

    describe('deck.dropCard', function () {

      it('Should call .updateFullCardInfo', function () {
        var card = cardsExcerpt[0];
        spyOn(deck, 'updateFullCardInfo');
        deck.dropCard(card.multiverseid);

        expect(deck.updateFullCardInfo).toHaveBeenCalled();
      });

      it('Should drop card id from options.cards', function () {
        spyOn(deck, 'updateFullCardInfo');

        var card = cardsExcerpt[0];
        deck.addCard(card.multiverseid);
        expect(deck.options.cards.length).toBe(1);
        expect(deck.options.cards[0]).toBe(card.multiverseid);

        deck.dropCard(card.multiverseid);
        expect(deck.options.cards.length).toBe(0);

      });

      it('Should drop only one card id if also if card is present multiple times', function () {
        spyOn(deck, 'updateFullCardInfo');
        var card = cardsExcerpt[0];
        deck.addCard(card.multiverseid);
        deck.addCard(card.multiverseid);
        expect(deck.options.cards.length).toBe(2);
        expect(deck.options.cards[1]).toBe(card.multiverseid);

        deck.dropCard(card.multiverseid);
        expect(deck.options.cards.length).toBe(1);
        expect(deck.options.cards[0]).toBe(card.multiverseid);
      });
    });

    describe('deck.dropAll', function () {

      it('Should call .updateFullCardInfo', function () {
        var card = cardsExcerpt[0];
        spyOn(deck, 'updateFullCardInfo');
        deck.dropAll(card.multiverseid);

        expect(deck.updateFullCardInfo).toHaveBeenCalled();
      });

      it('Should drop all cards with given id from options.cards', function () {
        spyOn(deck, 'updateFullCardInfo');

        var card1 = cardsExcerpt[0];
        var card2 = cardsExcerpt[1];
        deck.addCard(card1.multiverseid);
        deck.addCard(card1.multiverseid);
        deck.addCard(card2.multiverseid);
        expect(deck.options.cards.length).toBe(3);
        expect(deck.options.cards[0]).toBe(card1.multiverseid);
        expect(deck.options.cards[1]).toBe(card1.multiverseid);
        expect(deck.options.cards[2]).toBe(card2.multiverseid);

        deck.dropAll(card1.multiverseid);
        expect(deck.options.cards.length).toBe(1);
        expect(deck.options.cards[0]).toBe(card2.multiverseid);
      });
    });

    describe('deck.addCardToSideBoard', function () {

      it('Should call .updateFullCardInfo', function () {
        var card = cardsExcerpt[0];
        spyOn(deck, 'updateFullCardInfo');
        deck.addCardToSideBoard(card.multiverseid);

        expect(deck.updateFullCardInfo).toHaveBeenCalled();
      });

      it('Should add card id to options.sideboard', function () {
        var card = cardsExcerpt[0];
        spyOn(deck, 'updateFullCardInfo');
        deck.addCardToSideBoard(card.multiverseid);

        expect(deck.options.sideboard.length).toBe(1);
        expect(deck.options.sideboard[0]).toBe(card.multiverseid);
      });

      it('Should add card id to options.sideboard also if card id already exist', function () {
        var card = cardsExcerpt[0];
        deck.addCardToSideBoard(card.multiverseid);
        spyOn(deck, 'updateFullCardInfo');

        deck.addCardToSideBoard(card.multiverseid);
        expect(deck.options.sideboard.length).toBe(2);
        expect(deck.options.sideboard[1]).toBe(card.multiverseid);
      });
    });

    describe('deck.dropCardFromSideBoard', function () {

      it('Should call .updateFullCardInfo', function () {
        var card = cardsExcerpt[0];
        spyOn(deck, 'updateFullCardInfo');
        deck.dropCardFromSideBoard(card.multiverseid);

        expect(deck.updateFullCardInfo).toHaveBeenCalled();
      });

      it('Should drop card id from options.sideboard', function () {
        spyOn(deck, 'updateFullCardInfo');

        var card = cardsExcerpt[0];
        deck.addCardToSideBoard(card.multiverseid);
        expect(deck.options.sideboard.length).toBe(1);
        expect(deck.options.sideboard[0]).toBe(card.multiverseid);

        deck.dropCardFromSideBoard(card.multiverseid);
        expect(deck.options.sideboard.length).toBe(0);

      });

      it('Should drop only one card id if also if card is present multiple times', function () {
        spyOn(deck, 'updateFullCardInfo');
        var card = cardsExcerpt[0];
        deck.addCardToSideBoard(card.multiverseid);
        deck.addCardToSideBoard(card.multiverseid);
        expect(deck.options.sideboard.length).toBe(2);
        expect(deck.options.sideboard[1]).toBe(card.multiverseid);

        deck.dropCardFromSideBoard(card.multiverseid);
        expect(deck.options.sideboard.length).toBe(1);
        expect(deck.options.sideboard[0]).toBe(card.multiverseid);
      });
    });

    describe('deck.dropAllFromSideboard', function () {

      it('Should call .updateFullCardInfo', function () {
        var card = cardsExcerpt[0];
        spyOn(deck, 'updateFullCardInfo');
        deck.dropAllFromSideboard(card.multiverseid);

        expect(deck.updateFullCardInfo).toHaveBeenCalled();
      });

      it('Should drop all cards with given id from options.sideboard', function () {
        spyOn(deck, 'updateFullCardInfo');

        var card1 = cardsExcerpt[0];
        var card2 = cardsExcerpt[1];
        deck.addCardToSideBoard(card1.multiverseid);
        deck.addCardToSideBoard(card1.multiverseid);
        deck.addCardToSideBoard(card2.multiverseid);
        expect(deck.options.sideboard.length).toBe(3);
        expect(deck.options.sideboard[0]).toBe(card1.multiverseid);
        expect(deck.options.sideboard[1]).toBe(card1.multiverseid);
        expect(deck.options.sideboard[2]).toBe(card2.multiverseid);

        deck.dropAllFromSideboard(card1.multiverseid);
        expect(deck.options.sideboard.length).toBe(1);
        expect(deck.options.sideboard[0]).toBe(card2.multiverseid);
      });
    });

    describe('deck.moveCardToSideboard', function () {

      it('Should call deck.addCardToSideBoard', function () {
        var card = cardsExcerpt[0];
        spyOn(deck, 'addCardToSideBoard');

        deck.addCard(card.multiverseid);
        deck.moveCardToSideboard(card.multiverseid);

        expect(deck.addCardToSideBoard).toHaveBeenCalledWith(card.multiverseid);
      });

      it('Should remove card from deck.options.cards and add to deck.options.sideboard', function () {
        var card = cardsExcerpt[0];
        deck.addCard(card.multiverseid);

        expect(deck.options.cards.length).toBe(1);
        expect(deck.options.sideboard.length).toBe(0);
        deck.moveCardToSideboard(card.multiverseid);
        expect(deck.options.cards.length).toBe(0);
        expect(deck.options.sideboard.length).toBe(1);
      });
    });

    describe('deck.moveCardToMain', function () {

      it('Should call deck.addCard', function () {
        var card = cardsExcerpt[0];
        spyOn(deck, 'addCard');

        deck.addCardToSideBoard(card.multiverseid);
        deck.moveCardToMain(card.multiverseid);

        expect(deck.addCard).toHaveBeenCalledWith(card.multiverseid);
      });

      it('Should remove card from deck.options.sideboard and add to deck.options.cards', function () {
        var card = cardsExcerpt[0];
        deck.addCardToSideBoard(card.multiverseid);

        expect(deck.options.cards.length).toBe(0);
        expect(deck.options.sideboard.length).toBe(1);
        deck.moveCardToMain(card.multiverseid);
        expect(deck.options.cards.length).toBe(1);
        expect(deck.options.sideboard.length).toBe(0);
      });
    });

    describe('deck.getManaCurve', function () {

      it('Should always have at least 7 entries', function () {
        var manaCurve = deck.getManaCurve();
        expect(_.size(manaCurve)).toBe(7);
      });

      it('Should always have 0 count for entries if no card is present', function () {
        var manaCurve = deck.getManaCurve();
        _.each(manaCurve, function (entry) {
          expect(entry).toBe(0);
        });
      });

      it('Should return correct mana curve object', function () {
        var card1 = cardsExcerpt[0];
        var card2 = cardsExcerpt[1];
        var card3 = cardsExcerpt[2];
        deck.addCard(card1.id);
        deck.addCard(card2.id);
        deck.addCard(card2.id);
        deck.addCard(card3.id);
        deck.addCard(card3.id);
        deck.addCard(card3.id);

        var manaCurve = deck.getManaCurve();
        expect(manaCurve['1']).toBe(1);
        expect(manaCurve['2']).toBe(0);
        expect(manaCurve['3']).toBe(0);
        expect(manaCurve['4']).toBe(1);
        expect(manaCurve['5']).toBe(1);
        expect(manaCurve['6']).toBe(0);
        expect(manaCurve['7']).toBe(0);
      });
    });

    describe('deck.save', function () {

      it('Should call localStorageService.get decks to fetch already existing decks', function () {
        spyOn(localStorageService, 'get');
        spyOn(localStorageService, 'set');

        deck.save();

        expect(localStorageService.get).toHaveBeenCalledWith('decks');
      });

      it('Should call localStorageService.set decks if deck is not already in deck list', function () {
        spyOn(localStorageService, 'get');
        spyOn(localStorageService, 'set');

        deck.save();

        var callArgs = localStorageService.set.calls.allArgs();
        expect(callArgs[0]).toEqual(['decks', [deck.options.id]]);
      });

      it('Should call localStorageService.set decks if deck is not already in deck list', function () {
        spyOn(localStorageService, 'get');
        spyOn(localStorageService, 'set');

        deck.save();

        var callArgs = localStorageService.set.calls.allArgs();
        expect(localStorageService.set.calls.count()).toBe(2);
        expect(callArgs[0]).toEqual(['decks', [deck.options.id]]);
      });

      it('Should call localStorageService.set only ones if deck is is already present', function () {
        spyOn(localStorageService, 'get').and.returnValue([deck.options.id]);
        spyOn(localStorageService, 'set');

        deck.save();

        expect(localStorageService.set.calls.count()).toBe(1);
      });

      it('Should set save the correct values', function () {
        spyOn(localStorageService, 'get').and.returnValue([deck.options.id]);
        spyOn(localStorageService, 'set');

        deck.save();

        var callArgs = localStorageService.set.calls.allArgs();
        expect(callArgs[0]).toEqual(['deck-' + deck.options.id, deck.options]);
      });

    });

    describe('deck.getLegalities', function () {

      it('Should return correct legality list of deck', function () {
        deck.addCard('9d91ef4896ab4c1a5611d4d06971fc8026dd2f3f');
        deck.addCard('d8b74ea7f050c8c05588e002f0264643fc90209b');
        expect(deck.getLegalities()).toEqual({
          Standard: 'Legal',
          Modern: 'Legal',
          Vintage: 'Legal',
          Legacy: 'Legal',
          Commander: 'Legal'
        });
        deck.addCard('21f307b39c23f1a75c0220995acf179a68aede3b');
        expect(deck.getLegalities()).toEqual({
          Standard: 'Legal',
          Modern: 'Legal',
          Vintage: 'Restricted',
          Legacy: 'Banned',
          Commander: 'Banned'
        });
      });

    });

  });

  describe('Decks service API', function(){
    var deck1, deck2;
    beforeEach(function(){
      deck1 = decks.addNew();
      deck1.setName('deck1');
      deck1.save();

      deck2 = decks.addNew();
      deck2.setName('deck2');
      deck2.save();
    });

    afterEach(function(){
      localStorageService.clearAll();
    });

    describe('decks.existsByName', function(){

      it('Should return true if a deck with given name already exists', function(){
        expect(decks.existsByName('deck1')).toBe(true);
      });

      it('Should return false if a deck with given name doe not exists', function(){
        expect(decks.existsByName('deck3')).toBe(false);
      });

    });

    describe('decks.getById', function(){

      it('Should return the correct deck', function(){
        var id = deck1.options.id;
        expect(decks.getById(id)).toEqual(deck1);
      });

    });

    describe('decks.exportData', function(){

      it('Should return a map with all stored decks', function(){
        var decksToExport = decks.exportData();

        expect(_.size(decksToExport)).toBe(2);
      });

      it('Should return an empty map is no deck available', function(){
        localStorageService.clearAll();
        var decksToExport = decks.exportData();

        expect(decksToExport).toEqual({});
      });

    });

  });

});
