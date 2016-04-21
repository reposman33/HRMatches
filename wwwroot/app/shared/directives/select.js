/**
	* @ngdoc directive
	* @name global.directive:nameOfDirective
	* @scope
	* @restrict E
	*
	* @description
	* A description of the directive
	*
	* @param {object}  field   A field object
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