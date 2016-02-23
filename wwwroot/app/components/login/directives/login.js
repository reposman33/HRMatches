angular.module('app.HRMatches')

.directive('hrmLogin',['$http',function($http){
	return {
		restrict: 'A',
		scope: {},
		link: function($scope,elem,attr){
		},
		templateUrl: '/app/views/login.html'
	}
}])