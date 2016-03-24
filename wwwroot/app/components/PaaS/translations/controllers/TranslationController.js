angular.module('app.HRMatches')
.controller('TranslationController',
	['$scope','AppConfig','I18nService','translationCategories','languages','translations','SessionService',
	 function($scope,AppConfig,I18nService,translationCategories,languages,translations,SessionService){

		$scope.languages = languages;
		$scope.translationCategories = translationCategories;
		$scope.translations = translations;

		$scope.itemsPerPage = AppConfig.APP_PAGINATION_ITEMSPERPAGE;
		$scope.mrOfPagesButtons = AppConfig.APP_PAGINATION_NROFPAGEBUTTONS;
		$scope.currentPage = 1;
		
}])
