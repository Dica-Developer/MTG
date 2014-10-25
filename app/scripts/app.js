'use strict';

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
    'ui.bootstrap',
    'ui.router',
    'ui.select',
    'LocalStorageModule'
  ])
  .config(function (localStorageServiceProvider) {
    localStorageServiceProvider
      .setPrefix('mtg');
  });
