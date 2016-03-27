import App from '../../../src/js/app';

describe('Directive: cardText', function() {
  let compile, scope;

  beforeEach(angular.mock.module(App.name));
  beforeEach(angular.mock.inject(function($compile, $rootScope){
    compile = $compile;
    scope = $rootScope.$new();
  }));

  it('Should add mana symbol if present in text', function(){
    scope.cardText = 'Some Card text which costs {w} mana';
    var element = compile('<card-text data-text="{{cardText}}"></card-text>')(scope);
    scope.$digest();
    expect(element.find('i').hasClass('ms ms-cost ms-w')).to.be.true;
  });

  it('Should style text in ()', function(){
    scope.cardText = 'Some Card text with (text in braces)';
    var element = compile('<card-text data-text="{{cardText}}"></card-text>')(scope);
    scope.$digest();
    expect(element.find('i').text()).to.equal('(text in braces)');
    expect(element.find('i').hasClass('subheader')).to.be.true;
  });
});
