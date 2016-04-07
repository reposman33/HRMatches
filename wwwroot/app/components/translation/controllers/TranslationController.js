angular.module('app.HRMatches')
.controller('TranslationController',
	['$scope','AppConfig','data','SessionService','TranslationService','viewConfig',
	 function($scope,AppConfig,data,SessionService,TranslationService,viewConfig){

		$scope.viewConfig = viewConfig;

		$scope.currentPage = 1;

		$scope.paginate = function(newPage){
			$scope.currentDataPage = data.slice(((newPage-1)*$scope.viewConfig.pagination.itemsPerPage), ((newPage)*$scope.viewConfig.pagination.itemsPerPage))
		}

		 $scope.paginate($scope.currentPage);

		$scope.update = function(data){
			TranslationService.updateTranslationKey(data)
			.then(
				function(successResponse){
					return successResponse;
				},
				function(errorResponse){
					console.error('ERROR in updateTranslationKey(): ',errorResponse);
				}
			);
		}
}])
