/**
 * @ngdoc controller
 * @name app.ontdekJouwTalent.controller:ReferencesController
 * @description This controller contains functionality for Afdeling under 'Settings'
 * @requires $scope,
 * Referring states:'settings.references
 * */
angular.module('app.ontdekJouwTalent')
.controller('ReferencesController',['$scope','$state','AppConfig','APIService','data',function($scope,$state,AppConfig,APIService,data){

	$scope.data = data;
	$scope.showEditRow = false;

	$scope.delete = function(id){
		APIService.call({endpoint:AppConfig.API_ENDPOINTS.settings.references.endpoint,method:'DELETE'},{id:id})
		.then(
			function(successResponse){
				$state.reload($state.current);
			}
		)

	}

	$scope.save = function(reference){
		if(reference.id != undefined && reference.id.length > 0){
			// IF REFERENCE EXISTS, USE PUT
			var method = 'PUT';
		}
		else{
			// USE POST AND CREATE NEW, EMPTY ID
			var method = 'POST';
			reference.id = '';
		}
		APIService.call({endpoint:AppConfig.API_ENDPOINTS.settings.references.endpoint,method:method},{reference:reference})
		.then(
			function(successResponse){
				$state.reload($state.current);
			}
		)
	}
	
}])