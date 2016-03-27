import App from '../../../src/js/app';

describe('Directive: cardText', function () {
    let compile, scope;

    beforeEach(angular.mock.module(App.name));
    beforeEach(angular.mock.inject(function ($compile, $rootScope) {
        compile = $compile;
        scope = $rootScope.$new();
    }));

    it('Should set rarity per default to c (Common)', function () {
        let element;

        scope.setCode = 'M15';
        element = compile('<set-symbol data-set-code="{{setCode}}" data-size="2x"></set-symbol>')(scope);
        scope.$digest();
        expect(element.find('i').hasClass('ss-common')).to.be.true;
    });

    it('Should set rarity to m (Mythic Rare) for V14 (From the Vault: Annihilation)', function () {
        let element;

        scope.setCode = 'V14';
        element = compile('<set-symbol data-set-code="{{setCode}}" data-size="2x"></set-symbol>')(scope);
        scope.$digest();
        expect(element.find('i').hasClass('ss-mythic')).to.be.true;
    });

    xit('Should set rarity to s (Special) for VAN (Vanguard) and TSB (Timespiral "Timeshifted")', function () {
        scope.setCode = 'VAN';
        var element = compile('<set-symbol data-set-code="{{setCode}}" data-size="2x"></set-symbol>')(scope);
        scope.$digest();
        expect(element.find('img').attr('ng-src')).to.equal('http://gatherer.wizards.com/Handlers/Image.ashx?type=symbol&set=VAN&size=small&rarity=s');
        scope.setCode = 'TSB';
        scope.$digest();
        expect(element.find('img').attr('ng-src')).to.equal('http://gatherer.wizards.com/Handlers/Image.ashx?type=symbol&set=TSB&size=small&rarity=s');
    });

});
