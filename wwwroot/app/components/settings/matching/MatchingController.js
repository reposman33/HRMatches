/**
 * @ngdoc controller
 * @name app.ontdekJouwTalent.controller:MatchingController
 * @description This controller contains functionality for Matching Configurations under 'Settings'
 * @requires $scope,
 * Referring states:'settings.matching'
 * */
angular.module('app.ontdekJouwTalent')
.controller('MatchingController',['$scope','$state','AppConfig','APIService','data','SessionService',function($scope,$state,AppConfig,APIService,data,SessionService){
	$scope.data = data;

	$scope.delete = function(id){
		APIService.call({endpoint:AppConfig.API_ENDPOINTS.matchingconfigurations.endpoint,method:'DELETE'},{matchingId:id})
		.then(
			function(successResponse){
				$state.reload($state.current.name);
			}
		)
	}

	$scope.save = function(matchingConfiguration){
		var method = (matchingConfiguration.id != undefined && matchingConfiguration.id.length > 0)
			? 'PUT'
			: 'POST';
		APIService.call({endpoint:AppConfig.API_ENDPOINTS.matchingconfigurations.endpoint,method:method},{matchingConfiguration:matchingConfiguration})
		.then(
			function(successResponse){
				$state.go('^',null,{reload:true});
			}
		)
	}


}])