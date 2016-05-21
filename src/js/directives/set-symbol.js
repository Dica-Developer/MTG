import CardSetSymbolTplUrl from '../../templates/set-symbol.ejs';

export default function () {

    return {
        restrict: 'E',
        templateUrl: CardSetSymbolTplUrl,
        replace: true,
        scope: {
            'setCode': '@',
            'size': '@'
        },
        controller: ['$scope', function ($scope) {
            function update() {
                var rarity = '';
                switch ($scope.setCode) {
                case 'V14':
                case 'EXP':
                    rarity = 'mythic';
                    break;
                default :
                    rarity = 'common';
                    break;
                }
                $scope.rarity = rarity;
            }


            $scope.$watch('setCode', update);
        }]
    };
};
