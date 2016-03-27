import angular from 'angular';

import backup from './backup-service';
import cards from './cards-service';
import cardColor from './color-service';
import data from './data-service';
import decks from './deck-service';
import ownCards from './own-cards';
import sets from './sets-service';

export default angular.module('Services', [])
    .service('backup', backup)
    .service('cards', cards)
    .service('cardColor', cardColor)
    .service('data', data)
    .service('decks', decks)
    .service('ownCards', ownCards)
    .service('sets', sets);
