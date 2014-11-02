'use strict';

angular.module('mtgApp')
  .filter('propsFilter', function () {
    return function (items, props) {
      var out = [];

      if (angular.isArray(items)) {
        items.forEach(function (item) {
          Object.keys(props).forEach(function(prop){
            var text = props[prop].toLowerCase();
            if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
              out.push(item);
            }
          });
        });
      } else {
        // Let the output be the input untouched
        out = items;
      }

      return out;
    };
  });
