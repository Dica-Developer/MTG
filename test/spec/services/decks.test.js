import App from '../../../src/js/app';
import {size, each} from 'lodash';

describe('Service: decks', function () {
    let decks, cards, localStorageService;

    beforeEach(angular.mock.module(App.name));
    beforeEach(angular.mock.inject(function (_decks_, _cards_, _localStorageService_) {
        cards = _cards_;
        cards.db.insert(cardsExcerpt);
        decks = _decks_;
        localStorageService = _localStorageService_;
    }));

    afterEach(function () {
        decks.removeAll();
    });

    describe('Decks service API', function () {
        let deck1, deck2;
        beforeEach(function () {
            deck1 = decks.addNew();
            deck1.setName('deck1');

            deck2 = decks.addNew();
            deck2.setName('deck2');
        });

        afterEach(function () {
            localStorageService.clearAll();
        });

        describe('decks.existsByName', function () {

            it('Should return true if a deck with given name already exists', function () {
                expect(decks.existsByName('deck1')).to.be.true;
            });

            it('Should return false if a deck with given name doe not exists', function () {
                expect(decks.existsByName('deck3')).to.be.false;
            });

        });

        describe('decks.getById', () => {

            it('Should return the correct deck if in deckMap', () => {
                let id = deck1.getId();

                expect(decks.getById(id)).to.deep.equal(deck1);
            });

            it('Should return the correct deck if not in deckMap', () => {
                let deck;

                localStorageService.set('deck-123', { name: 'test', id: '123' });
                deck = decks.getById('123');
                expect(deck).to.not.be.null;
                expect(deck.options.id).to.equal('123');
                localStorageService.clearAll();
            });

            it('Should return `null` if deck does not exist', function () {
                expect(decks.getById('123')).to.be.null;
            });

        });

        describe('decks.exportData', () => {

            it('Should return a map with all stored decks', () => {
                expect(_.size(decks.exportData())).to.equal(2);
            });

            it('Should return an empty map is no deck available', () => {
                decks.removeAll();
                expect(decks.exportData()).to.deep.equal({});
            });

        });

        describe('decks.getCardsOfDeck', () => {

            it('Should return a list of full card data', () => {
                let card1 = cardsExcerpt[0],
                    card2 = cardsExcerpt[1],
                    cards;

                deck1.addCard(card1.id);
                deck1.addCard(card2.id);

                cards = decks.getCardsOfDeck(deck1.getId());
                expect(cards).to.have.lengthOf(2);
                expect(cards[0]).to.deep.equal(card1);
            });

        });

        describe('decks.getColorsOfDeck', () => {

            it('Should should an array with all colors used in the deck', function () {
                let colors, deck = decks.addNew();
                deck.addCard('9d91ef4896ab4c1a5611d4d06971fc8026dd2f3f');
                deck.addCard('d8b74ea7f050c8c05588e002f0264643fc90209b');

                colors = decks.getColorsOfDeck(deck.getId());
                expect(colors).to.deep.equal(['u', 'b']);
            });

        });

        describe('decks.getCardTypeCountOfDeck', () => {
            it('deck.getCountByCardType should return correct number of all cards in side board sorted by card type', function () {
                let deck = decks.addNew(),
                    card1 = cardsExcerpt[0],
                    card2 = cardsExcerpt[1];

                expect(decks.getCardTypeCountOfDeck(deck.getId())).to.deep.equal({});

                deck.addCard(card1.id);
                deck.addCard(card1.id);
                deck.addCard(card2.id);
                expect(decks.getCardTypeCountOfDeck(deck.getId())).to.deep.equal({ Creature: 2, Instant: 1 });
            });
        });

        describe('decks.getLegalitiesOfDeck', () => {

            it('Should return correct legality list of deck', () => {
                let deck = decks.addNew(),
                    deckId = deck.getId();

                deck.addCard('9d91ef4896ab4c1a5611d4d06971fc8026dd2f3f');
                deck.addCard('d8b74ea7f050c8c05588e002f0264643fc90209b');
                expect(decks.getLegalitiesOfDeck(deckId)).to.deep.equal({
                    Standard: 'Legal',
                    Modern: 'Legal',
                    Vintage: 'Legal',
                    Legacy: 'Legal',
                    Commander: 'Legal'
                });

                deck.addCard('21f307b39c23f1a75c0220995acf179a68aede3b');
                expect(decks.getLegalitiesOfDeck(deckId)).to.deep.equal({
                    Standard: 'Legal',
                    Modern: 'Legal',
                    Vintage: 'Restricted',
                    Legacy: 'Banned',
                    Commander: 'Banned'
                });
            });

        });

        describe('getManaCurveOfDeck', () => {
            let deck, deckId;

            beforeEach(function () {
                deck = decks.addNew();
                deckId = deck.getId();
            });

            it('Should always have at least 7 entries', () => {
                let manaCurve = decks.getManaCurveOfDeck(deckId);

                expect(size(manaCurve)).to.equal(7);
            });

            it('Should always have 0 count for entries if no card is present', () => {
                let manaCurve = decks.getManaCurveOfDeck(deckId);

                each(manaCurve, function (entry) {
                    expect(entry).to.equal(0);
                });
            });

            it('Should return correct mana curve object', () => {
                let card1 = cardsExcerpt[0],
                    card2 = cardsExcerpt[1],
                    card3 = cardsExcerpt[2],
                    manaCurve;

                deck.addCard(card1.id);
                deck.addCard(card2.id);
                deck.addCard(card2.id);
                deck.addCard(card3.id);
                deck.addCard(card3.id);
                deck.addCard(card3.id);

                manaCurve = decks.getManaCurveOfDeck(deckId);
                expect(manaCurve['1']).to.equal(1);
                expect(manaCurve['2']).to.equal(0);
                expect(manaCurve['3']).to.equal(0);
                expect(manaCurve['4']).to.equal(1);
                expect(manaCurve['5']).to.equal(1);
                expect(manaCurve['6']).to.equal(0);
                expect(manaCurve['7']).to.equal(0);
            });
        });

        describe('decks.saveDeckById', function () {
            let deck, deckId;

            beforeEach(() => {
                deck = decks.addNew();
                deckId = deck.getId();
            });

            afterEach(() => {
                localStorageService.get.restore();
                localStorageService.set.restore();
            });

            it('Should call localStorageService.get decks to fetch already existing decks', function () {
                sinon.stub(localStorageService, 'get');
                sinon.stub(localStorageService, 'set');

                decks.saveDeckById(deckId);

                expect(localStorageService.get).to.have.been.calledWith('decks');
            });

            it('Should call localStorageService.set decks if deck is not already in deck list', function () {
                sinon.stub(localStorageService, 'get');
                sinon.stub(localStorageService, 'set');

                decks.saveDeckById(deckId);

                expect(localStorageService.set).to.have.been.calledWith('decks', [deckId]);
            });

            it('Should call localStorageService.set decks if deck is not already in deck list', function () {
                sinon.stub(localStorageService, 'get');
                sinon.stub(localStorageService, 'set');

                decks.saveDeckById(deckId);

                expect(localStorageService.set).to.have.been.calledTwice;
                expect(localStorageService.set).to.have.been.calledWith('decks', [deckId]);
            });

            it('Should call localStorageService.set only ones if deck is is already present', function () {
                sinon.stub(localStorageService, 'get').returns([deckId]);
                sinon.stub(localStorageService, 'set');

                decks.saveDeckById(deckId);

                expect(localStorageService.set).to.have.been.calledOnce;
            });

            it('Should set save the correct values', function () {
                sinon.stub(localStorageService, 'get').returns([deckId]);
                sinon.stub(localStorageService, 'set');

                decks.saveDeckById(deckId);

                expect(localStorageService.set).to.have.been.calledWith('deck-' + deckId, deck.options);
            });

        });

    });

});
