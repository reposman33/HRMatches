angular.module('ontdekjouwtalent')

.directive('login',['$http',function($http){
	return {
		restrict: 'A',
		scope: {},
		link: function($scope,elem,attr){
		},
		templateUrl: '/app/views/login.html'
	}
}])