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
})
.directive('pwCheck', [function () {
	return {
		require: 'ngModel',
		link: function (scope, elem, attrs, ctrl) {
			var firstPassword = '#' + attrs.pwCheck;
			elem.add(firstPassword).on('keyup', function () {
				scope.$apply(function () {
					var v = elem.val()===$(firstPassword).val();
					ctrl.$setValidity('pwmatch', v);
				});
			});
		}
	}
}])

// Custom validator based on expressions.
// see: https://docs.angularjs.org/guide/forms
.directive('wjValidationError', function () {
	return {
		require: 'ngModel',
		link: function (scope, elm, attrs, ctl) {
			scope.$watch(attrs['wjValidationError'], function (errorMsg) {
				elm[0].setCustomValidity(errorMsg);
				ctl.$setValidity('wjValidationError', errorMsg ? false : true);
			});
		}
	}
})