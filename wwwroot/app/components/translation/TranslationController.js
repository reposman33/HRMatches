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

		var _data = data;

		// MAKE ROW EDITABLE WHEN THERE IS AT LEAST 1 CELL EDITABLE
		data.listView.configuration.row_editable = data.listView.configuration.columns.some(function(column,index,array){
			return column.cell_editable == true;
		});

		$scope.data = data;

		$scope.totalItems = _data.listView.data.length;
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
			$scope.data.listView.data = _data.listView.data.slice(((newPage-1)*$scope.data.listView.configuration.pagination.itemsPerPage), ((newPage)*$scope.data.listView.configuration.pagination.itemsPerPage))
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
