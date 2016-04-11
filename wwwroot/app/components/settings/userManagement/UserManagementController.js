angular.module('app.HRMatches')
.controller('UserManagementController',
	['$scope','AppConfig','data','UserManagementService','SessionService',
	function($scope,AppConfig,data,UserManagementService,SessionService) {
		// DUMMY DATA HERE
		$scope.data = data.data; // dit is dummy data
        $scope.viewConfig = data.configuration;
		UserManagementService.loadSettingsData({
			method: 'GET'
			,url: '/app/components/settings/dummyData.json'
		})
		.then(
			function(successResponse){
				$scope.settingsData = successResponse;
			}
		)

		$scope.assignRight = function(data){
	        UserManagementService.assignRight(data);
        }
	}]);
