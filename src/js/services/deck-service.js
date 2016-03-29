import Deck from '../classes/Deck';
import {without, uniq, includes, flatten, each, countBy, range} from 'lodash';

const COLOR_MAP = {
    'White': 'w',
    'Blue': 'u',
    'Black': 'b',
    'Red': 'r',
    'Green': 'g',
    'Colorless': 'c'
};

const STANDARD_LEGALITIES = {
    'Standard': 'Legal',
    'Modern': 'Legal',
    'Vintage': 'Legal',
    'Legacy': 'Legal',
    'Commander': 'Legal'
};


/*@ngInject*/
export default function DeckService(localStorageService, cards) {
    let decksMap = new Map(),
        lastChangeTimeStamp = null;


    function updateDeckIds(deckId) {
        let deckIds = localStorageService.get('decks') || [];
        if (!includes(deckIds, deckId)) {
            deckIds.push(deckId);
            localStorageService.set('decks', deckIds);
        }
    }

    function getFieldOfCardList(deckId, field) {
        let deck = decksMap.get(deckId),
            cardIds = uniq(deck.getCards());

        return cards.db({ id: cardIds }).select(field);
    }

    function getCardsOfDeck(deckId, mainCards) {
        let deck = decksMap.get(deckId),
            cardIds = mainCards ? deck.getCards() : deck.getSidedeckCards(),
            uniqCardIds = uniq(cardIds);

        return cards.filter({ id: uniqCardIds });
    }

    this.getAll = () => {
        let deckIds = localStorageService.get('decks');

        if (deckIds && deckIds.length !== decksMap.size) {
            deckIds.forEach(function (deckId) {
                let deckOptions = localStorageService.get('deck-' + deckId);
                decksMap.set(deckId, new Deck(deckOptions));
            });
        }
        return decksMap;
    };

    this.getById = (id) => {
        let deckOptions;
        if (decksMap.has(id)) {
            return decksMap.get(id);
        }

        deckOptions = localStorageService.get('deck-' + id);

        if (deckOptions) {
            let deck = new Deck(deckOptions);
            decksMap.set(id, deck);
            return deck;
        }

        return null;
    };

    this.addNew = () => {
        let deck = new Deck();
        decksMap.set(deck.getId(), deck);
        lastChangeTimeStamp = new Date().getTime();
        return deck;
    };

    this.exportData = () => {
        let exportData = {};

        decksMap.forEach((deck, deckId) => {
            exportData[deckId] = deck.options;
        });

        return exportData;
    };

    this.importData = (decks) => {
        each(decks, (deckOptions) => {
            let deck = new Deck(deckOptions),
                deckId = deck.getId();

            decksMap.set(deckId, deck);
            this.saveDeckById(deckId);
        });
    };

    this.lastChange = () => {
        return lastChangeTimeStamp;
    };

    this.existsByName = (name) => {
        let found = false;

        decksMap.forEach((deck) => {
            if (deck.getName() === name) {
                found = true;
            }
        });
        return found;
    };

    this.removeDeck = (deckId) => {
        let deckIds = localStorageService.get('decks');

        deckIds = without(deckIds, deckId);
        localStorageService.set('decks', deckIds);
        localStorageService.remove('deck-' + deckId);
        decksMap.delete(deckId);
        lastChangeTimeStamp = new Date().getTime();
    };

    this.removeAll = () => {
        decksMap.forEach((deck) => {
            this.removeDeck(deck.getId());
        });
    };

    this.saveDeckById = (deckId) => {
        let deck;

        if (!decksMap.has(deckId)) {
            throw new Error(`'Deck with id ${deckId} not found.'`);
        }

        deck = decksMap.get(deckId);
        localStorageService.set('deck-' + deckId, deck.options);
        updateDeckIds(deckId);
    };

    this.getCardsOfDeck = (deckId) => {
        return getCardsOfDeck(deckId, true);
    };

    this.getSideboardCardsOfDeck = (deckId) => {
        return getCardsOfDeck(deckId, false);
    };

    this.getCardTypeCountOfDeck = (deckId) => {
        let types = {},
            deck = decksMap.get(deckId),
            cards = this.getCardsOfDeck(deckId);

        cards.forEach((card) => {
            let cardTypesJoin = card.types.join('-');

            if (!types[cardTypesJoin]) {
                types[cardTypesJoin] = 0;
            }

            types[cardTypesJoin] = types[cardTypesJoin] + deck.getCountOf(card.id);
        });
        return types;
    };

    this.getColorsOfDeck = (deckId) => {
        let colors = getFieldOfCardList(deckId, 'colors'),
            flattened = flatten(colors),
            uniqe = uniq(flattened),
            withoutUndefined = without(uniqe, void 0);

        return withoutUndefined.map((color) => {
            return COLOR_MAP[color];
        });
    };

    this.getLegalitiesOfDeck = (deckId) => {
        let allCardLegalities = getFieldOfCardList(deckId, 'legalities'),
            standardLegalities = Object.assign({}, STANDARD_LEGALITIES);

        allCardLegalities.forEach(function (cardLegaleties) {
            each(cardLegaleties, function (legalety) {
                if (standardLegalities[legalety.format]) {
                    if (legalety.legality === 'Banned') {
                        standardLegalities[legalety.format] = legalety.legality;
                    } else if (legalety.legality === 'Restricted' && standardLegalities[legalety.format] !== 'Banned') {
                        standardLegalities[legalety.format] = legalety.legality;
                    }
                }
            });
        });
        return standardLegalities;
    };

    this.getShuffleOfDeck = (deckId, count) => {
        let deck = decksMap.get(deckId),
            shuffledCards = deck.getShuffle(count);

        return cards.filter({ id: shuffledCards });
    };

    this.getManaCurveOfDeck = (deckId) => {
        let cmcOfDeck = getFieldOfCardList(deckId, 'cmc'),
            countedCmcOfDeck = countBy(cmcOfDeck);

        range(1, 8).forEach(function (number) {
            if (!countedCmcOfDeck[number]) {
                countedCmcOfDeck[number] = 0;
            }
        });
        if (!countedCmcOfDeck.undefined) {
            delete countedCmcOfDeck.undefined;
        }
        return countedCmcOfDeck;
    };

    this.getMetaDataOfDeck = (deckId) => {
        return {
            cardTypeCount: this.getCardTypeCountOfDeck(deckId),
            deckColors: this.getColorsOfDeck(deckId),
            legalities: this.getLegalitiesOfDeck(deckId),
            manaCurve: this.getManaCurveOfDeck(deckId)
        }
    };
};
