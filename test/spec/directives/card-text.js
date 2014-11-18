'use strict';

describe('Directive: cardText', function() {
  var $compile,
    $rootScope;

  beforeEach(module('mtgApp'));
  beforeEach(module('templates'));

  beforeEach(inject(function(_$compile_, _$rootScope_){
    $compile = _$compile_;
    $rootScope = _$rootScope_;
  }));

  it('Should add mana symbol if present in text', function(){
    $rootScope.cardText = 'Some Card text which costs {w} mana';
    var element = $compile('<card-text data-text="{{cardText}}"></card-text>')($rootScope);
    $rootScope.$digest();
    expect(element.find('img').attr('ng-src')).toBe('http://mtgimage.com/symbol/mana/w.svg');
  });

  it('Should style text in ()', function(){
    $rootScope.cardText = 'Some Card text with (text in braces)';
    var element = $compile('<card-text data-text="{{cardText}}"></card-text>')($rootScope);
    $rootScope.$digest();
    expect(element.find('i').text()).toBe('(text in braces)');
    expect(element.find('i').hasClass('subheader')).toBe(true);
  });
});
