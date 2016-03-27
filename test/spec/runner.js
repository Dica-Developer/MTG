import 'angular';
import 'angular-mocks';

let testsContext = require.context(".", true, /.test$/);

testsContext.keys().forEach(testsContext);
