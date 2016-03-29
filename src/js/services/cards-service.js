import {each, map} from 'lodash';
import {taffy} from 'taffydb';


/*@ngInject*/
export default function CardsService($q, data, cardColor) {

    this.db = taffy();

    this.filter = (search) => {
        return this.db(search).get();
    };

    this.limitFilter = (searchQuery, limit) => {
        return this.db(searchQuery).limit(limit).get();
    };

    this.prepareDataBase = () => {
        let defer = $q.defer();
        if (this.db().count() === 0) {
            data.getCardData().then((cardData) => {
                each(cardData, (mtgSet) => {
                    let cards = _.map(mtgSet.cards, (card) => {
                        let foreignNames = card.foreignNames || [];

                        foreignNames.push({ name: card.name });
                        return Object.assign(
                            {},
                            card,
                            {
                                cardColor: cardColor.getColorBitsForDb(card.manaCost),
                                setCode: mtgSet.code,
                                setName: mtgSet.name,
                                foreignNames: foreignNames,
                                concatNames: map(foreignNames, 'name').join(' ° ')
                            }
                        );
                    });
                    this.db.insert(cards);
                });
                this.db.sort('name');
                defer.resolve();
            });
        } else {
            defer.resolve();
        }
        return defer.promise;
    };
};
