import CardFilterTplUrl from '../../templates/card-filter.ejs';

export default function () {
    return {
        restrict: 'E',
        scope: {
            db: '=',
            filteredCards: '=',
            filterUpdated: '=',
            cardName: '='
        },
        templateUrl: CardFilterTplUrl,
        controller: 'CardFilterController'
    };
};
