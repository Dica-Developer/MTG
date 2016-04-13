import CardExplorerTplUrl from '../templates/card-explorer.ejs';
import OwnCardsExplorerTplUrl from '../templates/own-cards.ejs';
import DeckListTplUrl from '../templates/deck-list.ejs';
import DeckBuilderTplUrl from '../templates/deck-builder.ejs';
import BackupTplUrl from '../templates/backup.ejs';

/*@ngInject*/
export default function routes($stateProvider, $urlRouterProvider) {
    $urlRouterProvider
        .otherwise('/');

    $stateProvider
        .state('card-explorer', {
            url: '/',
            templateUrl: CardExplorerTplUrl,
            controller: 'CardExplorerController'
        })
        .state('own-cards', {
            url: '/own-cards',
            templateUrl: OwnCardsExplorerTplUrl,
            controller: 'OwnCardsController'
        })
        .state('deck-list', {
            url: '/deck-list',
            templateUrl: DeckListTplUrl,
            controller: 'DeckListController'
        })
        .state('deck-builder', {
            url: '/deck-builder/:deckId',
            templateUrl: DeckBuilderTplUrl,
            controller: 'DeckBuilderController'
        })
        .state('backup', {
            url: '/backup',
            templateUrl: BackupTplUrl,
            controller: 'BackupController'
        });
};
