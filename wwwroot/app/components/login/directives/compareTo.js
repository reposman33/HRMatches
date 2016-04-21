/*
 *Compare two fields for equality and - as long as not equal - display a message.
 */
angular.module('app.ontdekJouwTalent')
.directive('compareTo',function() {
    return {
      require: "ngModel",
      restrict: 'AE',
      scope: {
        newValue: "=compareTo"
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