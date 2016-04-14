angular.module('app.HRMatches')
.controller('JoblistController',
	['$scope','AppConfig','JoblistService','data','SessionService',
	 function($scope,AppConfig,JoblistService,data,SessionService){

		var _data = data.data;
		$scope.viewConfig = data.configuration;
		$scope.totalItems = _data.length;
		$scope.currentPage = 1;

		$scope.paginate = function(newPage){
			$scope.data = _data.slice(((newPage-1) * $scope.viewConfig.pagination.itemsPerPage), ((newPage) * $scope.viewConfig.pagination.itemsPerPage))
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
