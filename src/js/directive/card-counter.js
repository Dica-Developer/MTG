import CardCounterTplUrl from '../../templates/card-counter.ejs';

export default function () {
    return {
        restrict: 'E',
        templateUrl: CardCounterTplUrl,
        replace: true,
        scope: {
            'cardId': '@'
        },
        controller: 'CardCounterController'
    };
};
