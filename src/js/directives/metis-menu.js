import $ from 'jquery';
import 'metismenu';

export default function () {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            $(function () {
                $('#' + attr.menuId).metisMenu();
            });
        }
    };
};
