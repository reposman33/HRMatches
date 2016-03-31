angular.module('app.HRMatches')
.controller('JoblistController',
	['$scope','AppConfig','JoblistService','APIResponse','SessionService',
	 function($scope,AppConfig,JoblistService,APIResponse,SessionService){

		$scope.data = APIResponse.data;
		$scope.viewConfig = APIResponse.configuration;

		$scope.currentPage = 1;

		$scope.paginate = function(newPage){
			$scope.currentDataPage = $scope.data.slice(((newPage-1) * $scope.viewConfig.pagination.itemsPerPage), ((newPage) * $scope.viewConfig.pagination.itemsPerPage))
		}

		$scope.paginate($scope.currentPage);

		$scope.update = function(data){
			JoblistService.update(data)
			.then(
				function(successResponse){
					return successResponse;
				},
				function(errorResponse){
					console.error('ERROR in updateJob(): ',errorResponse);
				}
			);
		}
}])
