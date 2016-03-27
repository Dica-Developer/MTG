import {taffy} from 'taffydb';
import {debounce} from 'lodash';

/*@ngInject*/
export default function ownCardsService(localStorageService) {
    var storedCards = localStorageService.get('cards') || [];
    var ownCardsDb = taffy(storedCards);

    function storeDb() {
        localStorageService.set('cards', ownCardsDb().stringify());
    }

    ownCardsDb.settings({
        onUpdate: debounce(storeDb, 1000),
        onInsert: debounce(storeDb, 1000),
        onRemove: debounce(storeDb, 1000)
    });

    function getAll() {
        return ownCardsDb().get();
    }

    function getById(id) {
        return ownCardsDb({ id: id }).get()[0];
    }

    function getCountOf(id) {
        var card = getById(id);
        return card ? card.count : 0;
    }

    function addCard(id) {
        var card = getById(id);
        if (card) {
            var count = card.count + 1;
            ownCardsDb({ id: id }).update({ count: count });
        } else {
            ownCardsDb.insert({
                id: id,
                count: 1
            });
        }
    }

    function removeCard(id) {
        var card = getById(id);
        if (card) {
            var count = card.count - 1;
            if (count > 0) {
                ownCardsDb({ id: id }).update({ count: count });
            } else {
                ownCardsDb({ id: id }).remove();
            }
        }
    }

    function importData(cardData) {
        ownCardsDb.insert(cardData);
        storeDb();
    }

    function clear() {
        ownCardsDb().remove();
    }

    return {
        getAll: getAll,
        getById: getById,
        getCountOf: getCountOf,
        addCard: addCard,
        removeCard: removeCard,
        importData: importData,
        clear: clear
    };
};
