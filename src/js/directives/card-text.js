/*@ngInject*/
export default function cardTextDirective($compile, SYMBOLS_REGEX_WITH_BRACES, TEXT_BETWEEN_PARANTHESES) {
    return {
        restrict: 'E',
        template: '<p></p>',
        replace: true,
        scope: {
            'text': '@'
        },
        link: function (scope, element) {

            scope.$watch('text', function () {
                element.empty();

                var newText = scope.text.replace(SYMBOLS_REGEX_WITH_BRACES, function (match) {
                    return '<mana-cost x-mana-cost="' + match + '" x-size="16"></mana-cost>';
                });

                newText = newText.replace(TEXT_BETWEEN_PARANTHESES, function (match) {
                    return '<i class="subheader">' + match + '</i>';
                });

                element.append(newText);
                $compile(element.contents())(scope);
            });
        }
    };
};
