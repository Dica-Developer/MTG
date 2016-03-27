/*@ngInject*/
export default function cardModalController($scope, $uibModalInstance, card) {
    $scope.card = card;

    $scope.ok = function () {
        $uibModalInstance.close();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
};
