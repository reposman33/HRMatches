/**
 * @ngdoc controller
 * @name app.ontdekJouwTalent.controller:ReferencesController
 * @description This controller contains functionality for Afdeling under 'Settings'
 * @requires $scope,
 * Referring states:'settings.references
 * */
angular.module('app.ontdekJouwTalent')
.controller('ReferencesController',['$scope','AppConfig','APIService','data',function($scope,AppConfig,APIService,data){

	$scope.data = data;
	$scope.showEditRow = false;

	$scope.delete = function(id){
		APIService.call({endpoint:AppConfig.API_ENDPOINTS.settings.references.endpoint,method:'DELETE'},{id:id});
	}

	$scope.save = function(reference){
		APIService.call({endpoint:AppConfig.API_ENDPOINTS.settings.references.endpoint,method:'PUT'},{reference:reference});
	}
	
}])