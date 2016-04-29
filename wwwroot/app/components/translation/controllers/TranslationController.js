/**
 * @ngdoc controller
 * @name app.ontdekJouwTalent.controller:TranslationController
 * @description
 * This controller contains functionality for language strings and editing translations.<br /><br />
 * Dependencies: $scope,data,SessionService,TranslationService<br />
 * Referring states: 'editTranslation'
 * */
angular.module('app.ontdekJouwTalent')
.controller('TranslationController',
	['$scope','data','SessionService','TranslationService',
	function($scope,data,SessionService,TranslationService){

		var _data = data.data;
		$scope.viewConfig = data.configuration;
		$scope.totalItems = _data.length;
		$scope.currentPage = 1;

		// PAGINATE
		/**
		 * @ngdoc method
		 * @name paginate
		 * @methodOf app.ontdekJouwTalent.controller:TranslationController
		 * @description
		 * Returns a subset of the translation strings as specified by the page parameter.<br/><br/>
		 * Dependencies:  $state,AuthService.
		 *
		 * @param {Integer} newPage  - the page to retrieve
		 */
		$scope.paginate = function(newPage){
			$scope.data = _data.slice(((newPage-1)*$scope.viewConfig.pagination.itemsPerPage), ((newPage)*$scope.viewConfig.pagination.itemsPerPage))
		}

		$scope.paginate($scope.currentPage);

			// EDIT
		 	/**
			 * @ngdoc method
			 * @name edit
			 * @methodOf app.ontdekJouwTalent.controller:TranslationController
			 * @description
			 * Submits an updated translation key.<br/><br/>
			 * Dependencies:  TranslationService.
			 *
			 * @param {Object} data - The new data to save {key: translationKey,value: translationValue}
			 */
		$scope.edit = function(data){
			TranslationService.updateTranslation(data)
			.then(
				function(successResponse){
					return successResponse;
				},
				function(errorResponse){
					console.error('ERROR in updateTranslationKey(): ',errorResponse);
				}
			);
		}
}]);
