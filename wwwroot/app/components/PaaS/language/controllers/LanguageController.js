angular.module('app.HRMatches')
.controller('LanguageController',
	['$scope','AppConfig','I18nService','translationCategories','languages','SessionService',
	 function($scope,AppConfig,I18nService,translationCategories,languages,SessionService){

		$scope.languages = languages;
		$scope.translationCategories = translationCategories;
		$scope.translations = I18nService.getData();
		$scope.editTranslation = function(id){
			// doeietsmetdiekey\
			console.log('Editing: ',id);
		}
}])
