angular.module('app.HRMatches')
.controller('TranslationController',
	['$scope','AppConfig','TranslationService','SessionService',
	 function($scope,AppConfig,TranslationService,SessionService){

		$scope.translations = TranslationService.getData();
		$scope.viewConfig = AppConfig.VIEWS.translations;
		$scope.currentPage = 1;
		
		$scope.updateTranslationKey = function(data){
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
