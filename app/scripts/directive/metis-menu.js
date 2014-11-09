/*global $*/

'use strict';

angular.module('mtgApp')
  .directive('metisMenu', [function () {
    return {
      restrict: 'A',
      link: function(scope, element, attr){
        $(function(){
          $('#' + attr.menuId).metisMenu();
        });
      }
    };
  }]);
