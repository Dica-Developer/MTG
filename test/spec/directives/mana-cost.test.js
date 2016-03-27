import App from '../../../src/js/app';
import {range} from 'lodash';

describe('Directive: manaCost', function () {
    let compile, scope;

    beforeEach(angular.mock.module(App.name));
    beforeEach(angular.mock.inject(function ($compile, $rootScope) {
        compile = $compile;
        scope = $rootScope.$new();
    }));

    it('Should add mana-cost for numbers 0-9', function () {
        let numbers = range(10),
            element = compile('<mana-cost x-mana-cost="{{manaCost}}" x-size="16"></mana-cost>')(scope);

        numbers.forEach(function (number) {
            scope.manaCost = number;
            scope.$digest();
            expect(element.find('i').hasClass('ms-' + number)).to.be.true;
        });
    });

    it('Should add correct symbol for mana', function () {
        let manaSymbols = ['W', 'U', 'B', 'R', 'G', 'X', 'P', 'S'];

        manaSymbols.forEach(function (symbol) {
            scope.symbol = symbol;
            var element = compile('<mana-cost x-mana-cost="{{symbol}}" x-size="16"></mana-cost>')(scope);
            scope.$digest();
            expect(element.find('i').hasClass('ms-' + symbol.toLowerCase())).to.be.true;
        });
    });

    xit('Should add correct other symbols', function () {
        let manaSymbols = ['T', 'Q', 'C'];

        manaSymbols.forEach(function (symbol) {
            scope.symbol = symbol;
            var element = compile('<mana-cost x-mana-cost="{{symbol}}" x-size="16"></mana-cost>')(scope);
            scope.$digest();
            expect(element.find('img').attr('ng-src')).toBe('http://gatherer.wizards.com/Handlers/Image.ashx?size=medium&name=' + symbol.toLowerCase() + '&type=symbol');
        });
    });

    it('Should add mana if mana cost is devided by a slash ({B/R})', function () {
        let element, symbol = '{B/R}';
        scope.symbol = symbol;

        element = compile('<mana-cost x-mana-cost="{{symbol}}" x-size="16"></mana-cost>')(scope);
        scope.$digest();
        expect(element.find('i').hasClass('ms-br')).to.be.true;
    });
});

