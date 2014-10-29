'use strict';

//important for working with node-webkit
if (typeof _ === 'undefined') {
  window._ = require('lodash');
}

/**
 * @ngdoc overview
 * @name mtgApp
 * @description
 * # mtgApp
 *
 * Main module of the application.
 */
angular
  .module('mtgApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'mm.foundation',
    'ui.router',
    'ui.select',
    'LocalStorageModule'
  ])
  .config(function (localStorageServiceProvider) {
    localStorageServiceProvider
      .setPrefix('mtg');
  });
