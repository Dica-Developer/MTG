/*@ngInject*/
export default function fileChangeDirective($parse) {
    return {
        restrict: 'A',
        link: function ($scope, element, attrs) {
            var attrHandler = $parse(attrs.fileChange);
            var handler = function (event) {
                $scope.$apply(function () {
                    attrHandler($scope, { $event: event, files: event.target.files });
                });
            };
            element[0].addEventListener('change', handler, false);
        }
    };
};
