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

  it('Should set rarity per default to c (Common)', function(){
    $rootScope.setCode = 'M15';
    var element = $compile('<set-symbol data-set-code="{{setCode}}" data-size="22"></set-symbol>')($rootScope);
    $rootScope.$digest();
    expect(element.find('img').attr('ng-src')).toBe('http://gatherer.wizards.com/Handlers/Image.ashx?type=symbol&set=M15&size=small&rarity=c');
  });

  it('Should set rarity to m (Mythic Rare) for V14 (From the Vault: Annihilation)', function(){
    $rootScope.setCode = 'V14';
    var element = $compile('<set-symbol data-set-code="{{setCode}}" data-size="22"></set-symbol>')($rootScope);
    $rootScope.$digest();
    expect(element.find('img').attr('ng-src')).toBe('http://gatherer.wizards.com/Handlers/Image.ashx?type=symbol&set=V14&size=small&rarity=m');
  });

  it('Should set rarity to s (Special) for VAN (Vanguard) and TSB (Timespiral "Timeshifted")', function(){
    $rootScope.setCode = 'VAN';
    var element = $compile('<set-symbol data-set-code="{{setCode}}" data-size="22"></set-symbol>')($rootScope);
    $rootScope.$digest();
    expect(element.find('img').attr('ng-src')).toBe('http://gatherer.wizards.com/Handlers/Image.ashx?type=symbol&set=VAN&size=small&rarity=s');
    $rootScope.setCode = 'TSB';
    $rootScope.$digest();
    expect(element.find('img').attr('ng-src')).toBe('http://gatherer.wizards.com/Handlers/Image.ashx?type=symbol&set=TSB&size=small&rarity=s');
  });

  it('Should set correct dimensions', function(){
    $rootScope.setCode = 'M14';
    var element = $compile('<set-symbol data-set-code="{{setCode}}" data-size="22"></set-symbol>')($rootScope);
    $rootScope.$digest();
    expect(element.find('img').width()).toBe(22);
    expect(element.find('img').height()).toBe(22);

    element = $compile('<set-symbol data-set-code="{{setCode}}" data-size="13"></set-symbol>')($rootScope);
    $rootScope.$digest();
    expect(element.find('img').width()).toBe(13);
    expect(element.find('img').height()).toBe(13);

  });
});
