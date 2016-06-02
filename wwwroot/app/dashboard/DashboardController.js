/**
 * @ngdoc controller
 * @name app.ontdekJouwTalent.controller:DashboardController
 * @description
 * This controller contains functionality for language Dashbord component
 * Referring states: 'dashboard'
 * */
angular.module('app.ontdekJouwTalent')
.controller('DashboardController',['$scope','data',function($scope,data){

	$scope.data = data;
	
}])