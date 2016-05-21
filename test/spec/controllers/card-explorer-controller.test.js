import App from '../../../src/js/app';
import {range, map, noop} from 'lodash';

describe('Controller: CardExplorerController', () => {
    const MOCK_CARDS = map(range(25), value => { 
        return { multiverseid: value };
    });
    const cardDetailsDialog = sinon.stub({
        show: noop
    });
    const cards = sinon.stub({
        db: noop
    });

    let $scope;

    beforeEach(angular.mock.module(App.name));
    beforeEach(angular.mock.inject(($controller, $rootScope) => {
        $scope = $rootScope.$new();
        $controller('CardExplorerController', {
            $scope,
            cardDetailsDialog,
            cards
        });
        $scope.filteredCards = MOCK_CARDS; 
    }));

    it('should have correct initial values', () => {
        expect($scope.maxResultLength).to.equal(20);
        expect($scope.currentPage).to.equal(1);
    });

    it('should update cards if page has changed', () => {
        $scope.currentPage = 2;
        $scope.$apply();
        expect($scope.cards[0].multiverseid).to.equal(20);
    });

    it('should update card amount if maxResultLength has changed', () => {
        $scope.maxResultLength = 23;
        $scope.$apply();
        expect($scope.cards.length).to.equal(23);
    });

    it('should update cards if filterUpdateTimeStamp has changed', () => {
        $scope.filterUpdateTimeStamp = new Date().getTime();
        $scope.$apply();
        expect($scope.cards.length).to.equal(20);
    });

    it('$scope.showCardModal should call cardDetailsDialog.show', () => {
        $scope.showCardModal();
        expect(cardDetailsDialog.show).to.have.been.called;
    });
});
