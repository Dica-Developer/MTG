/*@ngInject*/
export default function cardCounterController($scope, ownCards) {
    const { getCountOf, addCard, removeCard } = ownCards;
    
    let id = $scope.cardId;
    $scope.count = getCountOf(id);

    $scope.addCard = (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();
        addCard(id);
    };

    $scope.removeCard = (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();
        if ($scope.count > 0) {
            removeCard(id);
        }
    };

    const getCount = function () {
        return getCountOf(id);
    };

    $scope.$watch(getCount, (newValue, oldValue) => {
        if (newValue !== oldValue) {
            $scope.count = newValue;
        }
    });

    $scope.$watch('cardId', (newValue, oldValue) => {
        if (newValue && newValue !== oldValue) {
            id = newValue;
            $scope.count = getCountOf(id);
        }
    });
};
