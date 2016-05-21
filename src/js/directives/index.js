import angular from 'angular';

import cardCounter from './card-counter';
import cardFilter from './card-filter';
import cardSetSymbol from './card-set-symbol';
import cardText from './card-text';
import fileChange from './file-change';
import manaCost from './mana-cost';
import metisMenu from './metis-menu';
import setSymbol from './set-symbol';

export default angular.module('Directives', [])
    .directive('cardCounter', cardCounter)
    .directive('cardFilter', cardFilter)
    .directive('cardSetSymbol', cardSetSymbol)
    .directive('cardText', cardText)
    .directive('fileChange', fileChange)
    .directive('manaCost', manaCost)
    .directive('metisMenu', metisMenu)
    .directive('setSymbol', setSymbol);