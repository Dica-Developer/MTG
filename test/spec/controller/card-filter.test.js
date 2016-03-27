import App from '../../../src/js/app';
import {taffy} from 'taffydb';

describe('Controller: CardFilterController', function () {
    let scope;

    beforeEach(angular.mock.module(App.name));
    beforeEach(angular.mock.inject(function ($controller, $rootScope, $q) {
        scope = $rootScope.$new();
        scope.db = taffy();
        $controller('CardFilterController', {
            $scope: scope,
            data: {
                getSetList: function () {
                    return $q.when([
                        {
                            code: 'TEST'
                        }
                    ]);
                },
                isAvailable: function () {
                    return true;
                }
            },
            sets: {
                filter: function () {
                    return [{ code: 'TEST' }];
                }
            }
        });
    }));

    beforeEach(function(){
        sinon.spy(scope, 'db');
    });

    afterEach(function(){
        scope.db.restore();
    });

    it('should have correct initial values', function () {
        expect(scope.cardName).to.equal('');
        expect(scope.filteredCards).to.have.length(0);
        expect(scope.selectedSets).to.be.null;
        expect(scope.combinedManaCost).to.equal(-1);
        expect(scope.colors).to.deep.equal({
            W: false,
            B: false,
            G: false,
            U: false,
            R: false,
            C: false
        });
        scope.$apply();
        expect(scope.setList).to.deep.equal([{ code: 'TEST' }]);
    });

    it('should query db with correct card name', function () {
        scope.$apply();
        expect(scope.db).to.not.have.been.called;
        scope.$apply(function () {
            scope.cardName = 'Test Creature';
        });
        expect(scope.db).to.have.been.calledWith({
            concatNames: Object({ likenocase: 'Test Creature' }),
            cardColor: 0
        });
        expect(scope.filterUpdated).to.be.a('Number');
    });

    it('should query db with correct set code', function () {
        scope.$apply();
        expect(scope.db).to.not.have.been.called;
        scope.$apply(function () {
            scope.selectedSets = [scope.setList[0]];
        });
        expect(scope.db).to.have.been.calledWith({ setCode: ['TEST'], cardColor: 0 });
        expect(scope.filterUpdated).to.be.a('Number');
    });

    it('should query db with correct color', function () {
        scope.$apply();
        expect(scope.db).to.not.have.been.called;
        scope.$apply(function () {
            scope.colors.W = true;
            scope.colors.B = true;
        });
        expect(scope.db).to.have.been.calledWith({ cardColor: 5 });
        expect(scope.filterUpdated).to.be.a('Number');
    });

    it('should query db with correct cmc', function () {
        scope.$apply();
        expect(scope.db).to.not.have.been.called;
        scope.$apply(function () {
            scope.combinedManaCost = 2;
        });
        expect(scope.db).to.have.been.calledWith({ cmc: 2, cardColor: 0 });
        expect(scope.filterUpdated).to.be.a('Number');
    });

    it('should query db with correct value', function () {
        scope.$apply();
        expect(scope.db).to.not.have.been.called;
        scope.cardName = 'Test Creature';
        scope.selectedSets = [scope.setList[0]];
        scope.colors.W = true;
        scope.combinedManaCost = 2;
        scope.$apply();
        expect(scope.db).to.have.been.calledWith({
            concatNames: { likenocase: 'Test Creature' },
            setCode: ['TEST'],
            cmc: 2,
            cardColor: 1
        });
        expect(scope.filterUpdated).to.be.a('Number');
    });
});
