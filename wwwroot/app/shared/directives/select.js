
/*
<div class="btn-group" uib-dropdown>
<button id="btn-append-to-single-button" type="button" class="btn btn-primary" uib-dropdown-toggle>
Inline Dropdown <span class="caret"></span>
    </button>
    <ul class="dropdown-menu" uib-dropdown-menu role="menu" aria-labelledby="btn-append-to-single-button">
    <li role="menuitem"><a href="#">Action</a></li>
    <li role="menuitem"><a href="#">Another action</a></li>
<li role="menuitem"><a href="#">Something else here</a></li>
<li class="divider"></li>
    <li role="menuitem"><a href="#">Separated link</a></li>
</ul>
</div>
*/


/*
 *Compare two fields for equality and - as long as not equal - display a message.
 */
angular.module('app.HRMatches')
    .directive('select',function() {
        return {
            restrict: 'A',
            scope: {
                config: ""
            },
            link: function(scope, element, attributes, ngModel) {

                ngModel.$validators.compareTo = function(modelValue) {
                    return modelValue === scope.newValue;
                };

                scope.$watch('newValue', function(newValue) {
                    ngModel.$validate(newValue);
                });
            }
        };
    });