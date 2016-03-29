import {map, each, isUndefined, size, bindAll} from 'lodash';

function isMigrationNeeded(data) {
    return isUndefined(data.version);
}

function tryToParseData(data) {
    var parsedData = false;
    try {
        parsedData = JSON.parse(data);
    } catch (err) {
        console.error('backup.tryToParseData: Cannot parse data');
    }

    return parsedData;
}

function updateCards(oldCards, db) {
    let multiverseIDs = map(oldCards, 'multiverseid'),
        multiversIdsAsNumber = map(multiverseIDs, Number),
        dbCardsId = db({ 'multiverseid': multiversIdsAsNumber }).select('id');

    return map(oldCards, function (card, index) {
        return {
            id: dbCardsId[index],
            count: card.count
        };
    });
}

function updateDecks(decks, db) {
    return each(decks, deck  => {
        let sidedeckMultiverseIdAsNumber,
            multiverseIdAsNumber = map(deck.cards, Number);

        deck.cards = db({ 'multiverseid': multiverseIdAsNumber }).select('id');
        if (deck.sideboard && deck.sideboard.length) {
            sidedeckMultiverseIdAsNumber = map(deck.sideboard, Number);
            deck.sideboard = db({ 'multiverseid': sidedeckMultiverseIdAsNumber }).select('id');
        }
    });
}

function migrateData(data, db) {
    data.cards = data.cards || data.ownCards;
    if (data.cards.length && data.cards[0].multiverseid) {
        data.cards = updateCards(data.cards, db);
    }

    if (size(data.decks) > 0) {
        data.decks = updateDecks(data.decks, db);
    }

    return data;
}

/*@ngInject*/
export default function BackupService(cards, decks, ownCards) {

    this.getImportData = function(rawData) {
        var data = tryToParseData(rawData);

        if (!data) {
            return false;
        }

        if (isMigrationNeeded(data)) {
            data = migrateData(data, cards.db);
        }

        return data;
    };

    this.importData = function(data) {
        if (data.decks) {
            decks.importData(data.decks);
        }

        if (data.cards) {
            ownCards.importData(data.cards);
        }
    };

    this.getDecksForExport = function() {
        return decks.exportData();
    };

    this.getCardsForExport = function() {
        return ownCards.getAll();
    }
};
