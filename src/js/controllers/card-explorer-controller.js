import CardModalTplUrl from '../../templates/card-modal.ejs';

/*@ngInject*/
export default function cardExplorerController($scope, $uibModal, cards) {
    $scope.scope = $scope;
    $scope.db = cards.db;
    $scope.filteredCards = [];
    $scope.maxResultLength = 20;
    $scope.currentPage = 1;
    $scope.cards = [];
    $scope.totalItems = 0;
    $scope.filterCollapsed = true;

    function updateList() {
        $scope.cards = $scope.filteredCards.slice(($scope.currentPage - 1) * $scope.maxResultLength, $scope.currentPage * $scope.maxResultLength);
        $scope.totalItems = $scope.filteredCards.length;
    }

    $scope.showCardModal = function (card) {
        $uibModal.open({
            templateUrl: CardModalTplUrl,
            controller: 'CardModalController',
            size: 'lg',
            resolve: {
                card: function () {
                    return card;
                }
            }
        });
    };

    $scope.$watch('currentPage', updateList);
    $scope.$watch('maxResultLength', updateList);
    $scope.$watch('filterUpdateTimeStamp', updateList);
};