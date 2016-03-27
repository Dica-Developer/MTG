import App from '../../../src/js/app';
import {size} from 'lodash';

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
        window.localStorage.clear();
    });

    describe('Deck', function () {
        let deck;
        beforeEach(function () {
            deck = decks.addNew();
            sinon.spy(deck, 'updateFullCardInfo');
        });

        afterEach(function () {
            deck.updateFullCardInfo.restore();
        });

        it('Should be defined and have default values', function () {
            let options = deck.options;
            expect(deck).to.not.be.undefined;

            expect(options.id).to.not.be.undefined;
            expect(options.id).to.be.a('String');

            expect(options.name).to.not.be.undefined;
            expect(options.name).to.be.a('String');
            expect(options.name).to.equal('');

            expect(options.cards).to.not.be.undefined;
            expect(options.cards).to.be.an('Array');
            expect(options.cards).to.have.lengthOf(0);

            expect(options.sideboard).to.not.be.undefined;
            expect(options.sideboard).to.be.an('Array');
            expect(options.sideboard).to.have.lengthOf(0);

            expect(deck.cardsFull).to.not.be.undefined;
            expect(deck.cardsFull).to.be.an('Array');
            expect(deck.cardsFull).to.have.lengthOf(0);

            expect(deck.sideboardFull).to.not.be.undefined;
            expect(deck.sideboardFull).to.be.an('Array');
            expect(deck.sideboardFull).to.have.lengthOf(0);
        });

        it('deck.setName should add given name to deck.options', function () {
            var name = 'Awesome Deck';
            expect(deck.options.name).to.equal('');

            deck.setName(name);
            expect(deck.options.name).to.equal(name);
        });

        it('deck.getName should should return deck name', function () {
            var name = 'Awesome Deck';
            deck.options.name = name;
            expect(deck.getName()).to.equal(name);
        });

        it('deck.setType should set tyoe to deck', function () {
            expect(deck.options.type).to.be.undefined;
            deck.setType('Commander');
            expect(deck.options.type).to.equal('Commander');
        });

        it('deck.getColors should should an array with all colors used in the deck', function () {
            deck.addCard('9d91ef4896ab4c1a5611d4d06971fc8026dd2f3f');
            deck.addCard('d8b74ea7f050c8c05588e002f0264643fc90209b');
            var colors = deck.getColors();
            expect(colors).to.deep.equal(['u', 'b']);
        });

        it('deck.getCountOf should return correct number of cards exist in deck with given id', function () {
            var card1 = cardsExcerpt[0];
            var card2 = cardsExcerpt[1];
            var card3 = cardsExcerpt[2];
            expect(deck.getCountOf(card1.multiverseid)).to.equal(0);
            expect(deck.getCountOf(card2.multiverseid)).to.equal(0);
            expect(deck.getCountOf(card3.multiverseid)).to.equal(0);

            deck.addCard(card1.multiverseid);

            deck.addCard(card2.multiverseid);
            deck.addCard(card2.multiverseid);

            deck.addCard(card3.multiverseid);
            deck.addCard(card3.multiverseid);
            deck.addCard(card3.multiverseid);

            expect(deck.getCountOf(card1.multiverseid)).to.equal(1);
            expect(deck.getCountOf(card2.multiverseid)).to.equal(2);
            expect(deck.getCountOf(card3.multiverseid)).to.equal(3);

        });

        it('deck.getSideboardCountOf should return correct number of cards exist in deck side board with given id', function () {
            var card1 = cardsExcerpt[0];
            var card2 = cardsExcerpt[1];
            var card3 = cardsExcerpt[2];
            expect(deck.getSideboardCountOf(card1.multiverseid)).to.equal(0);
            expect(deck.getSideboardCountOf(card2.multiverseid)).to.equal(0);
            expect(deck.getSideboardCountOf(card3.multiverseid)).to.equal(0);

            deck.addCardToSideBoard(card1.multiverseid);

            deck.addCardToSideBoard(card2.multiverseid);
            deck.addCardToSideBoard(card2.multiverseid);

            deck.addCardToSideBoard(card3.multiverseid);
            deck.addCardToSideBoard(card3.multiverseid);
            deck.addCardToSideBoard(card3.multiverseid);

            expect(deck.getSideboardCountOf(card1.multiverseid)).to.equal(1);
            expect(deck.getSideboardCountOf(card2.multiverseid)).to.equal(2);
            expect(deck.getSideboardCountOf(card3.multiverseid)).to.equal(3);

        });

        it('deck.getCardCount should return correct number of all cards in main deck', function () {
            var card1 = cardsExcerpt[0];
            expect(deck.getCardCount()).to.equal(0);

            deck.addCard(card1.multiverseid);
            expect(deck.getCardCount()).to.equal(1);

            deck.addCard(card1.multiverseid);
            expect(deck.getCardCount()).to.equal(2);
        });

        it('deck.getSideboardCount should return correct number of all cards in side board', function () {
            var card1 = cardsExcerpt[0];
            expect(deck.getSideboardCount()).to.equal(0);

            deck.addCardToSideBoard(card1.multiverseid);
            expect(deck.getSideboardCount()).to.equal(1);

            deck.addCardToSideBoard(card1.multiverseid);
            expect(deck.getSideboardCount()).to.equal(2);
        });

        it('deck.getCountByCardType should return correct number of all cards in side board sorted by card type', function () {
            var card1 = cardsExcerpt[0];
            var card2 = cardsExcerpt[1];
            expect(deck.getCountByCardType()).to.deep.equal({});

            deck.addCard(card1.id);
            deck.addCard(card1.id);
            deck.addCard(card2.id);
            expect(deck.getCountByCardType()).to.deep.equal({ Creature: 2, Instant: 1 });
        });

        describe('deck.addCard', function () {

            it('Should call .updateFullCardInfo', function () {
                var card = cardsExcerpt[0];
                deck.addCard(card.multiverseid);
                expect(deck.updateFullCardInfo).to.have.been.called;
            });

            it('Should add card id to options.cards', function () {
                var card = cardsExcerpt[0];
                deck.addCard(card.multiverseid);

                expect(deck.options.cards).to.have.lengthOf(1);
                expect(deck.options.cards[0]).to.equal(card.multiverseid);
            });

            it('Should add card id to options.cards also if card id already exist', function () {
                var card = cardsExcerpt[0];
                deck.addCard(card.multiverseid);
                deck.addCard(card.multiverseid);
                expect(deck.options.cards).to.have.lengthOf(2);
                expect(deck.options.cards[1]).to.equal(card.multiverseid);
            });
        });

        describe('deck.dropCard', function () {

            it('Should call .updateFullCardInfo', function () {
                var card = cardsExcerpt[0];
                deck.dropCard(card.multiverseid);

                expect(deck.updateFullCardInfo).to.have.been.called;
            });

            it('Should drop card id from options.cards', function () {

                var card = cardsExcerpt[0];
                deck.addCard(card.multiverseid);
                expect(deck.options.cards).to.have.lengthOf(1);
                expect(deck.options.cards[0]).to.equal(card.multiverseid);

                deck.dropCard(card.multiverseid);
                expect(deck.options.cards).to.have.lengthOf(0);

            });

            it('Should drop only one card id if also if card is present multiple times', function () {
                var card = cardsExcerpt[0];
                deck.addCard(card.multiverseid);
                deck.addCard(card.multiverseid);
                expect(deck.options.cards).to.have.lengthOf(2);
                expect(deck.options.cards[1]).to.equal(card.multiverseid);

                deck.dropCard(card.multiverseid);
                expect(deck.options.cards).to.have.lengthOf(1);
                expect(deck.options.cards[0]).to.equal(card.multiverseid);
            });
        });

        describe('deck.dropAll', function () {

            it('Should call .updateFullCardInfo', function () {
                var card = cardsExcerpt[0];
                deck.dropAll(card.multiverseid);

                expect(deck.updateFullCardInfo).to.have.been.called;
            });

            it('Should drop all cards with given id from options.cards', function () {

                var card1 = cardsExcerpt[0];
                var card2 = cardsExcerpt[1];
                deck.addCard(card1.multiverseid);
                deck.addCard(card1.multiverseid);
                deck.addCard(card2.multiverseid);
                expect(deck.options.cards).to.have.lengthOf(3);
                expect(deck.options.cards[0]).to.equal(card1.multiverseid);
                expect(deck.options.cards[1]).to.equal(card1.multiverseid);
                expect(deck.options.cards[2]).to.equal(card2.multiverseid);

                deck.dropAll(card1.multiverseid);
                expect(deck.options.cards).to.have.lengthOf(1);
                expect(deck.options.cards[0]).to.equal(card2.multiverseid);
            });
        });

        describe('deck.addCardToSideBoard', function () {

            it('Should call .updateFullCardInfo', function () {
                var card = cardsExcerpt[0];
                deck.addCardToSideBoard(card.multiverseid);

                expect(deck.updateFullCardInfo).to.have.been.called;
            });

            it('Should add card id to options.sideboard', function () {
                var card = cardsExcerpt[0];
                deck.addCardToSideBoard(card.multiverseid);

                expect(deck.options.sideboard).to.have.lengthOf(1);
                expect(deck.options.sideboard[0]).to.equal(card.multiverseid);
            });

            it('Should add card id to options.sideboard also if card id already exist', function () {
                var card = cardsExcerpt[0];
                deck.addCardToSideBoard(card.multiverseid);

                deck.addCardToSideBoard(card.multiverseid);
                expect(deck.options.sideboard).to.have.lengthOf(2);
                expect(deck.options.sideboard[1]).to.equal(card.multiverseid);
            });
        });

        describe('deck.dropCardFromSideBoard', function () {

            it('Should call .updateFullCardInfo', function () {
                var card = cardsExcerpt[0];
                deck.dropCardFromSideBoard(card.multiverseid);

                expect(deck.updateFullCardInfo).to.have.been.called;
            });

            it('Should drop card id from options.sideboard', function () {

                var card = cardsExcerpt[0];
                deck.addCardToSideBoard(card.multiverseid);
                expect(deck.options.sideboard).to.have.lengthOf(1);
                expect(deck.options.sideboard[0]).to.equal(card.multiverseid);

                deck.dropCardFromSideBoard(card.multiverseid);
                expect(deck.options.sideboard).to.have.lengthOf(0);

            });

            it('Should drop only one card id if also if card is present multiple times', function () {
                var card = cardsExcerpt[0];
                deck.addCardToSideBoard(card.multiverseid);
                deck.addCardToSideBoard(card.multiverseid);
                expect(deck.options.sideboard).to.have.lengthOf(2);
                expect(deck.options.sideboard[1]).to.equal(card.multiverseid);

                deck.dropCardFromSideBoard(card.multiverseid);
                expect(deck.options.sideboard).to.have.lengthOf(1);
                expect(deck.options.sideboard[0]).to.equal(card.multiverseid);
            });
        });

        describe('deck.dropAllFromSideboard', function () {

            it('Should call .updateFullCardInfo', function () {
                var card = cardsExcerpt[0];
                deck.dropAllFromSideboard(card.multiverseid);

                expect(deck.updateFullCardInfo).to.have.been.called;
            });

            it('Should drop all cards with given id from options.sideboard', function () {

                var card1 = cardsExcerpt[0];
                var card2 = cardsExcerpt[1];
                deck.addCardToSideBoard(card1.multiverseid);
                deck.addCardToSideBoard(card1.multiverseid);
                deck.addCardToSideBoard(card2.multiverseid);
                expect(deck.options.sideboard).to.have.lengthOf(3);
                expect(deck.options.sideboard[0]).to.equal(card1.multiverseid);
                expect(deck.options.sideboard[1]).to.equal(card1.multiverseid);
                expect(deck.options.sideboard[2]).to.equal(card2.multiverseid);

                deck.dropAllFromSideboard(card1.multiverseid);
                expect(deck.options.sideboard).to.have.lengthOf(1);
                expect(deck.options.sideboard[0]).to.equal(card2.multiverseid);
            });
        });

        describe('deck.moveCardToSideboard', function () {

            it('Should call deck.addCardToSideBoard', function () {
                var card = cardsExcerpt[0];
                sinon.spy(deck, 'addCardToSideBoard');

                deck.addCard(card.multiverseid);
                deck.moveCardToSideboard(card.multiverseid);

                expect(deck.addCardToSideBoard).to.have.been.calledWith(card.multiverseid);
                deck.addCardToSideBoard.restore();
            });

            it('Should remove card from deck.options.cards and add to deck.options.sideboard', function () {
                var card = cardsExcerpt[0];
                deck.addCard(card.multiverseid);

                expect(deck.options.cards).to.have.lengthOf(1);
                expect(deck.options.sideboard).to.have.lengthOf(0);
                deck.moveCardToSideboard(card.multiverseid);
                expect(deck.options.cards).to.have.lengthOf(0);
                expect(deck.options.sideboard).to.have.lengthOf(1);
            });
        });

        describe('deck.moveCardToMain', function () {

            it('Should call deck.addCard', function () {
                var card = cardsExcerpt[0];
                sinon.spy(deck, 'addCard');

                deck.addCardToSideBoard(card.multiverseid);
                deck.moveCardToMain(card.multiverseid);

                expect(deck.addCard).to.have.been.calledWith(card.multiverseid);
                deck.addCard.restore();
            });

            it('Should remove card from deck.options.sideboard and add to deck.options.cards', function () {
                var card = cardsExcerpt[0];
                deck.addCardToSideBoard(card.multiverseid);

                expect(deck.options.cards).to.have.lengthOf(0);
                expect(deck.options.sideboard).to.have.lengthOf(1);
                deck.moveCardToMain(card.multiverseid);
                expect(deck.options.cards).to.have.lengthOf(1);
                expect(deck.options.sideboard).to.have.lengthOf(0);
            });
        });

        describe('deck.getManaCurve', function () {

            it('Should always have at least 7 entries', function () {
                var manaCurve = deck.getManaCurve();
                expect(size(manaCurve)).to.equal(7);
            });

            it('Should always have 0 count for entries if no card is present', function () {
                var manaCurve = deck.getManaCurve();
                _.each(manaCurve, function (entry) {
                    expect(entry).to.equal(0);
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
                expect(manaCurve['1']).to.equal(1);
                expect(manaCurve['2']).to.equal(0);
                expect(manaCurve['3']).to.equal(0);
                expect(manaCurve['4']).to.equal(1);
                expect(manaCurve['5']).to.equal(1);
                expect(manaCurve['6']).to.equal(0);
                expect(manaCurve['7']).to.equal(0);
            });
        });

        describe('deck.save', function () {

            it('Should call localStorageService.get decks to fetch already existing decks', function () {
                sinon.stub(localStorageService, 'get');
                sinon.stub(localStorageService, 'set');

                deck.save();

                expect(localStorageService.get).to.have.been.calledWith('decks');
                localStorageService.get.restore();
                localStorageService.set.restore();
            });

            it('Should call localStorageService.set decks if deck is not already in deck list', function () {
                sinon.stub(localStorageService, 'get');
                sinon.stub(localStorageService, 'set');

                deck.save();

                expect(localStorageService.set).to.have.been.calledWith('decks', [deck.options.id]);
                localStorageService.get.restore();
                localStorageService.set.restore();
            });

            it('Should call localStorageService.set decks if deck is not already in deck list', function () {
                sinon.stub(localStorageService, 'get');
                sinon.stub(localStorageService, 'set');

                deck.save();

                expect(localStorageService.set).to.have.been.calledTwice;
                expect(localStorageService.set).to.have.been.calledWith('decks', [deck.options.id]);
                localStorageService.get.restore();
                localStorageService.set.restore();
            });

            it('Should call localStorageService.set only ones if deck is is already present', function () {
                sinon.stub(localStorageService, 'get').returns([deck.options.id]);
                sinon.stub(localStorageService, 'set');

                deck.save();

                expect(localStorageService.set).to.have.been.calledOnce;
                localStorageService.get.restore();
                localStorageService.set.restore();
            });

            it('Should set save the correct values', function () {
                sinon.stub(localStorageService, 'get').returns([deck.options.id]);
                sinon.stub(localStorageService, 'set');

                deck.save();

                expect(localStorageService.set).to.have.been.calledWith('deck-' + deck.options.id, deck.options);
                localStorageService.get.restore();
                localStorageService.set.restore();
            });

        });

        describe('deck.getLegalities', function () {

            it('Should return correct legality list of deck', function () {
                deck.addCard('9d91ef4896ab4c1a5611d4d06971fc8026dd2f3f');
                deck.addCard('d8b74ea7f050c8c05588e002f0264643fc90209b');
                expect(deck.getLegalities()).to.deep.equal({
                    Standard: 'Legal',
                    Modern: 'Legal',
                    Vintage: 'Legal',
                    Legacy: 'Legal',
                    Commander: 'Legal'
                });
                deck.addCard('21f307b39c23f1a75c0220995acf179a68aede3b');
                expect(deck.getLegalities()).to.deep.equal({
                    Standard: 'Legal',
                    Modern: 'Legal',
                    Vintage: 'Restricted',
                    Legacy: 'Banned',
                    Commander: 'Banned'
                });
            });

        });

    });

    describe('Decks service API', function () {
        var deck1, deck2;
        beforeEach(function () {
            deck1 = decks.addNew();
            deck1.setName('deck1');
            deck1.save();

            deck2 = decks.addNew();
            deck2.setName('deck2');
            deck2.save();
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

        describe('decks.getById', function () {

            it('Should return the correct deck', function () {
                var id = deck1.options.id;
                expect(decks.getById(id)).to.deep.equal(deck1);
            });

        });

        describe('decks.exportData', function () {

            it('Should return a map with all stored decks', function () {
                var decksToExport = decks.exportData();

                expect(_.size(decksToExport)).to.equal(2);
            });

            it('Should return an empty map is no deck available', function () {
                localStorageService.clearAll();
                var decksToExport = decks.exportData();

                expect(decksToExport).to.deep.equal({});
            });

        });

    });

});
