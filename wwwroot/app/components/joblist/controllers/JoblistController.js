/**
 * @ngdoc controller
 * @name app.ontdekJouwTalent.controller:JoblistController
 * @description
 * This controller contains functionality for the Joblist option in Navigation menu.<br /><br />
 * Dependencies: $scope,$state,AppConfig,AuthService,TranslationService,SessionService<br />
 * Referring states: 'joblist'
 * */
angular.module('app.ontdekJouwTalent')
.controller('JoblistController',
	['$scope','AppConfig','JoblistService','data','SessionService',
	 function($scope,AppConfig,JoblistService,data,SessionService){

		var _data = data.data;
		$scope.viewConfig = data.configuration;
		$scope.totalItems = _data.length;
		$scope.currentPage = 1;

		// PAGINATE
		/**
		 * @ngdoc method
		 * @name paginate
		 * @methodOf app.ontdekJouwTalent.controller:JoblistController
		 * @description
		 * Returns a subset of the translation strings as specified by the page parameter.<br/><br/>
		 *
		 * @param {Integer} newPage  - the page to retrieve
		 */
		$scope.paginate = function(newPage){
			$scope.data = _data.slice(((newPage-1) * $scope.viewConfig.pagination.itemsPerPage), ((newPage) * $scope.viewConfig.pagination.itemsPerPage))
		}

		$scope.paginate($scope.currentPage);

		$scope.edit = function(id){
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
}]);
