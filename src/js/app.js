'use strict';
import '../less/main.less';
import angular from 'angular';
import Router from 'angular-ui-router';
import AngularUi from 'angular-ui-bootstrap';
import AngularUiSelect from 'ui-select';
import AngularSanitize from 'angular-sanitize';
import AngularAnimate from 'angular-animate';
import LocalStorageModule from 'angular-local-storage';
import Controllers from './controllers';
import Directives from './directive';
import Services from './services';
import Constants from './constants';
import Filters from './filter';
import Routes from './routes';

//important for working with node-webkit
if (typeof _ === 'undefined') {
    window._ = require('lodash');
}

export default angular
    .module('mtgApp', [
        LocalStorageModule,
        Router,
        AngularUi,
        AngularUiSelect,
        AngularSanitize,
        AngularAnimate,
        Controllers.name,
        Directives.name,
        Services.name,
        Constants.name,
        Filters.name
        /*'ngAnimate',
         'ngCookies',
         'ngResource',
         'ngRoute',
         'ngTouch',
         'tc.chartjs'*/
    ])
    .config(Routes)
    .config(function (localStorageServiceProvider) {
        'ngInject';
        localStorageServiceProvider
            .setPrefix('mtg');
    });
