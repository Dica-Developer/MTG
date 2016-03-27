import angular from 'angular';

import CardCounterController from './card-counter-controller';
import CardExplorerController from './card-explorer-controller';
import CardFilterController from './card-filter-controller';
import CardModalController from './card-modal-controller';
import DatabasesController from './databases-controller';
import DeckBuilderController from './deck-builder-controller';
import DeckListController from './deck-list-controller';
import ExportDialogController from './export-dialog-controller';
import ImportDialogController from './import-dialog-controller';
import MenuController from './menu-controller';
import OwnCardsController from './own-cards-controller';
import UtilController from './util-controller';


export default angular.module('Controllers', [])
    .controller('CardCounterController', CardCounterController)
    .controller('CardExplorerController', CardExplorerController)
    .controller('CardFilterController', CardFilterController)
    .controller('CardModalController', CardModalController)
    .controller('DatabasesController', DatabasesController)
    .controller('DeckBuilderController', DeckBuilderController)
    .controller('DeckListController', DeckListController)
    .controller('ExportDialogController', ExportDialogController)
    .controller('ImportDialogController', ImportDialogController)
    .controller('MenuController', MenuController)
    .controller('OwnCardsController', OwnCardsController)
    .controller('UtilController', UtilController);
