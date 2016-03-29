// Karma configuration
// http://karma-runner.github.io/0.12/config/configuration-file.html
// Generated on 2014-10-23 using
// generator-karma 0.8.3

var webpackConfig = require('./webpack');

module.exports = function (config) {
    'use strict';

    config.set({
        basePath: './',
        frameworks: ['mocha', 'sinon-chai', 'es6-shim'],
        files: [
            'test/mock/**/*.js',
            'test/spec/runner.js'
        ],

        preprocessors: {
            'test/spec/runner.js': ['webpack', 'sourcemap']
        },

        reporters: ['mocha', 'coverage'],

        coverageReporter: {
            dir: 'test/coverage/',
            reporters: [
                { type: 'html', subdir: '.' },
                { type: 'lcovonly', subdir: '.', file: 'lcov.info' }
            ]
        },

        webpack: webpackConfig,
        webpackMiddleware: {
            // webpack-dev-middleware configuration
            // i. e.
            noInfo: true
        },

        exclude: [],

        port: 8080,

        browsers: [
            'PhantomJS'
        ],

        colors: true,

        logLevel: config.LOG_INFO

    });
};
