angular.module('app.HRMatches')
.controller('TranslationController',
	['$scope','AppConfig','TranslationService','data','SessionService',
	 function($scope,AppConfig,TranslationService,data,SessionService){

		$scope.viewConfig = AppConfig.VIEWS.translations.viewConfig;
		$scope.currentPage = 1;

		$scope.paginate = function(newPage){
			$scope.currentDataPage = data.slice(((newPage-1)*AppConfig.VIEWS.translations.viewConfig.pagination.itemsPerPage), ((newPage)*AppConfig.VIEWS.translations.viewConfig.pagination.itemsPerPage))
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
