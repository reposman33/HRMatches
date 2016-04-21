/**
	* @ngdoc directive
	* @name app.ontdekJouwTalent.directive:select
	* @scope
	* @restrict A
	*
	* @description
	* Checks if 2 fields are the same. Usage: compare-to='field-to-compare-to',ng-model='field'
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