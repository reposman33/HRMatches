angular.module('app.HRMatches')
.directive('compareTo',function() {
    return {
      require: "ngModel",
      restrict: 'AE',
      scope: {
        newPassword: "=compareTo"
      },
      link: function(scope, element, attributes, ngModel) {

        ngModel.$validators.compareTo = function(modelValue) {
        	return modelValue === scope.newPassword;
        };

        scope.$watch('newPassword', function(newValue) {
          ngModel.$validate(newValue);
        });
      }
    };
  });