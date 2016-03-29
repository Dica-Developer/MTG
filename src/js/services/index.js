import angular from 'angular';

import BackupService from './backup-service';
import CardsService from './cards-service';
import ColorService from './color-service';
import data from './data-service';
import DeckService from './deck-service';
import ownCards from './own-cards';
import sets from './sets-service';

export default angular.module('Services', [])
    .service('backup', BackupService)
    .service('cards', CardsService)
    .service('cardColor', ColorService)
    .service('data', data)
    .service('decks', DeckService)
    .service('ownCards', ownCards)
    .service('sets', sets);
