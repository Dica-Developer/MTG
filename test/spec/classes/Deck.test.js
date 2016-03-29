import Deck from '../../../src/js/classes/Deck';

describe('Class: Deck', () => {

    describe('Initializing', () => {

        it('Should initialize with default options', () => {
            let deck = new Deck();

            expect(deck.getName()).to.equal('');
            expect(deck.getCards()).to.have.lengthOf(0);
            expect(deck.getSidedeckCards()).to.have.lengthOf(0);
            expect(deck.getId()).to.not.be.undefined;
        });

        it('Should override default options', () => {
            let deck = new Deck({
                name: 'Test Deck',
                id: 'DeckId',
                cards: [1, 2, 3],
                sideboard: [1, 2, 3]
            });

            expect(deck.getName()).to.equal('Test Deck');
            expect(deck.getCards()).to.have.lengthOf(3);
            expect(deck.getSidedeckCards()).to.have.lengthOf(3);
            expect(deck.getId()).to.equal('DeckId');
        })

    });

    describe('Members', () => {
        let deck, name = 'Awesome Deck';

        beforeEach(() => {
            deck = new Deck();
        });

        it('deck.setName should add given name to deck.options', () => {
            expect(deck.options.name).to.equal('');
            deck.setName(name);
            expect(deck.options.name).to.equal(name);
        });

        it('deck.getName should should return deck name', () => {
            deck.options.name = name;
            expect(deck.getName()).to.equal(name);
        });

        it('deck.setType should set tyoe to deck', () => {
            expect(deck.options.type).to.be.undefined;
            deck.setType('Commander');
            expect(deck.options.type).to.equal('Commander');
        });

        it('deck.getCountOf should return correct number of cards exist in deck with given id', () => {
            let card1 = cardsExcerpt[0],
                card2 = cardsExcerpt[1],
                card3 = cardsExcerpt[2];

            expect(deck.getCountOf(card1.id)).to.equal(0);
            expect(deck.getCountOf(card2.id)).to.equal(0);
            expect(deck.getCountOf(card3.id)).to.equal(0);

            deck.addCard(card1.id);

            deck.addCard(card2.id);
            deck.addCard(card2.id);

            deck.addCard(card3.id);
            deck.addCard(card3.id);
            deck.addCard(card3.id);

            expect(deck.getCountOf(card1.id)).to.equal(1);
            expect(deck.getCountOf(card2.id)).to.equal(2);
            expect(deck.getCountOf(card3.id)).to.equal(3);

        });

        it('deck.getSideboardCountOf should return correct number of cards exist in deck side board with given id', () => {
            let card1 = cardsExcerpt[0],
                card2 = cardsExcerpt[1],
                card3 = cardsExcerpt[2];

            expect(deck.getSideboardCountOf(card1.id)).to.equal(0);
            expect(deck.getSideboardCountOf(card2.id)).to.equal(0);
            expect(deck.getSideboardCountOf(card3.id)).to.equal(0);

            deck.addCardToSideBoard(card1.id);

            deck.addCardToSideBoard(card2.id);
            deck.addCardToSideBoard(card2.id);

            deck.addCardToSideBoard(card3.id);
            deck.addCardToSideBoard(card3.id);
            deck.addCardToSideBoard(card3.id);

            expect(deck.getSideboardCountOf(card1.id)).to.equal(1);
            expect(deck.getSideboardCountOf(card2.id)).to.equal(2);
            expect(deck.getSideboardCountOf(card3.id)).to.equal(3);

        });

        it('deck.getCardCount should return correct number of all cards in main deck', () => {
            let card1 = cardsExcerpt[0];

            expect(deck.getCardCount()).to.equal(0);

            deck.addCard(card1.id);
            expect(deck.getCardCount()).to.equal(1);

            deck.addCard(card1.id);
            expect(deck.getCardCount()).to.equal(2);
        });

        it('deck.getSideboardCount should return correct number of all cards in side board', () => {
            let card1 = cardsExcerpt[0];

            expect(deck.getSideboardCount()).to.equal(0);

            deck.addCardToSideBoard(card1.id);
            expect(deck.getSideboardCount()).to.equal(1);

            deck.addCardToSideBoard(card1.id);
            expect(deck.getSideboardCount()).to.equal(2);
        });

        describe('deck.addCard', () => {

            it('Should throw an error if cardId is not a string', () => {
                var wrapperFn = () => {
                    deck.addCard(1);
                };

                expect(wrapperFn).to.throw(Error);
                expect(wrapperFn).to.throw(/Id is not type of `string` but: number/);
            });

            it('Should add card id to options.cards', () => {
                let card = cardsExcerpt[0];

                deck.addCard(card.id);

                expect(deck.options.cards).to.have.lengthOf(1);
                expect(deck.options.cards[0]).to.equal(card.id);
            });

            it('Should add card id to options.cards also if card id already exist', function () {
                let card = cardsExcerpt[0];

                deck.addCard(card.id);
                deck.addCard(card.id);
                expect(deck.options.cards).to.have.lengthOf(2);
                expect(deck.options.cards[1]).to.equal(card.id);
            });
        });

        describe('deck.dropCard', () => {


            it('Should drop card id from options.cards', () => {
                let card = cardsExcerpt[0];

                deck.addCard(card.id);
                expect(deck.options.cards).to.have.lengthOf(1);
                expect(deck.options.cards[0]).to.equal(card.id);

                deck.dropCard(card.id);
                expect(deck.options.cards).to.have.lengthOf(0);

            });

            it('Should drop only one card id also if card is present multiple times', () => {
                let card = cardsExcerpt[0];

                deck.addCard(card.id);
                deck.addCard(card.id);
                expect(deck.options.cards).to.have.lengthOf(2);
                expect(deck.options.cards[1]).to.equal(card.id);

                deck.dropCard(card.id);
                expect(deck.options.cards).to.have.lengthOf(1);
                expect(deck.options.cards[0]).to.equal(card.id);
            });
        });

        describe('deck.dropAll', () => {

            it('Should drop all cards with given id from options.cards', () => {
                let card1 = cardsExcerpt[0],
                    card2 = cardsExcerpt[1];

                deck.addCard(card1.id);
                deck.addCard(card1.id);
                deck.addCard(card2.id);
                expect(deck.options.cards).to.have.lengthOf(3);
                expect(deck.options.cards[0]).to.equal(card1.id);
                expect(deck.options.cards[1]).to.equal(card1.id);
                expect(deck.options.cards[2]).to.equal(card2.id);

                deck.dropAll(card1.id);
                expect(deck.options.cards).to.have.lengthOf(1);
                expect(deck.options.cards[0]).to.equal(card2.id);
            });
        });

        describe('deck.addCardToSideBoard', () => {

            it('Should add card id to options.sideboard', () => {
                let card = cardsExcerpt[0];

                deck.addCardToSideBoard(card.id);

                expect(deck.options.sideboard).to.have.lengthOf(1);
                expect(deck.options.sideboard[0]).to.equal(card.id);
            });

            it('Should add card id to options.sideboard also if card id already exist', () => {
                let card = cardsExcerpt[0];

                deck.addCardToSideBoard(card.id);

                deck.addCardToSideBoard(card.id);
                expect(deck.options.sideboard).to.have.lengthOf(2);
                expect(deck.options.sideboard[1]).to.equal(card.id);
            });
        });

        describe('deck.dropCardFromSideBoard', () => {

            it('Should drop card id from options.sideboard', () => {
                let card = cardsExcerpt[0];

                deck.addCardToSideBoard(card.id);
                expect(deck.options.sideboard).to.have.lengthOf(1);
                expect(deck.options.sideboard[0]).to.equal(card.id);

                deck.dropCardFromSideBoard(card.id);
                expect(deck.options.sideboard).to.have.lengthOf(0);

            });

            it('Should drop only one card id if also if card is present multiple times', () => {
                let card = cardsExcerpt[0];

                deck.addCardToSideBoard(card.id);
                deck.addCardToSideBoard(card.id);
                expect(deck.options.sideboard).to.have.lengthOf(2);
                expect(deck.options.sideboard[1]).to.equal(card.id);

                deck.dropCardFromSideBoard(card.id);
                expect(deck.options.sideboard).to.have.lengthOf(1);
                expect(deck.options.sideboard[0]).to.equal(card.id);
            });
        });

        describe('deck.dropAllFromSideboard', () => {

            it('Should drop all cards with given id from options.sideboard', () => {
                let card1 = cardsExcerpt[0],
                    card2 = cardsExcerpt[1];

                deck.addCardToSideBoard(card1.id);
                deck.addCardToSideBoard(card1.id);
                deck.addCardToSideBoard(card2.id);
                expect(deck.options.sideboard).to.have.lengthOf(3);
                expect(deck.options.sideboard[0]).to.equal(card1.id);
                expect(deck.options.sideboard[1]).to.equal(card1.id);
                expect(deck.options.sideboard[2]).to.equal(card2.id);

                deck.dropAllFromSideboard(card1.id);
                expect(deck.options.sideboard).to.have.lengthOf(1);
                expect(deck.options.sideboard[0]).to.equal(card2.id);
            });
        });

        describe('deck.moveCardToSideboard', () => {

            it('Should call deck.addCardToSideBoard', () => {
                let card = cardsExcerpt[0];

                sinon.spy(deck, 'addCardToSideBoard');

                deck.addCard(card.id);
                deck.moveCardToSideboard(card.id);

                expect(deck.addCardToSideBoard).to.have.been.calledWith(card.id);
                deck.addCardToSideBoard.restore();
            });

            it('Should remove card from deck.options.cards and add to deck.options.sideboard', () => {
                let card = cardsExcerpt[0];

                deck.addCard(card.id);

                expect(deck.options.cards).to.have.lengthOf(1);
                expect(deck.options.sideboard).to.have.lengthOf(0);
                deck.moveCardToSideboard(card.id);
                expect(deck.options.cards).to.have.lengthOf(0);
                expect(deck.options.sideboard).to.have.lengthOf(1);
            });
        });

        describe('deck.moveCardToMain', () => {

            it('Should call deck.addCard', () => {
                let card = cardsExcerpt[0];

                sinon.spy(deck, 'addCard');

                deck.addCardToSideBoard(card.id);
                deck.moveCardToMain(card.id);

                expect(deck.addCard).to.have.been.calledWith(card.id);
                deck.addCard.restore();
            });

            it('Should remove card from deck.options.sideboard and add to deck.options.cards', () => {
                let card = cardsExcerpt[0];

                deck.addCardToSideBoard(card.id);

                expect(deck.options.cards).to.have.lengthOf(0);
                expect(deck.options.sideboard).to.have.lengthOf(1);
                deck.moveCardToMain(card.id);
                expect(deck.options.cards).to.have.lengthOf(1);
                expect(deck.options.sideboard).to.have.lengthOf(0);
            });
        });

        describe('deck.hasCard', () => {

            it('Should return true if card is in deck', () => {
                let card = cardsExcerpt[0];

                deck.addCard(card.id);
                expect(deck.hasCard(card.id)).to.be.true;
            });

            it('Should return false if card is not in deck', () => {
                let card = cardsExcerpt[0];

                deck.addCard(card.id);
                expect(deck.hasCard('123')).to.be.false;
            });

        });

        describe('deck.getShuffle', () => {

            it('Should return given number card ids', () => {
                for (let i = 0; i <= 10; i++) {
                    deck.addCard(cardsExcerpt[i].id);
                }

                expect(deck.getShuffle(5)).to.have.lengthOf(5);
                expect(deck.getShuffle(7)).to.have.lengthOf(7);
            });

        });
    });

});
