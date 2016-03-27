import CardSetSymbolTplUrl from '../../templates/set-symbol.ejs';

export default function () {

    return {
        restrict: 'E',
        templateUrl: CardSetSymbolTplUrl,
        replace: true,
        scope: {
            'card': '=',
            'size': '@',
            'tipText': '@',
            'tipAppearance': '@'
        },
        controller: ['$scope', function ($scope) {
            $scope.$watch('card', function (card) {
                if (card) {
                    $scope.setCode = card.setCode;
                    $scope.rarity = card.rarity ? card.rarity.toLowerCase() : 'common';
                }
            }, true);
        }]
    };
};
