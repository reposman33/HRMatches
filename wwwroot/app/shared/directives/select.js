/**
	* @ngdoc directive
	* @name app.ontdekJouwTalent.directive:select
	* @scope
	* @restrict A
	*
	* @description
	* Checks if 2 fields are the same.
	*
	*
	*/
	angular.module('app.ontdekJouwTalent')
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