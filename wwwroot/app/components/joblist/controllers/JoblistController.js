/**
 * @ngdoc controller
 * @name app.ontdekJouwTalent.controller:JoblistController
 * @description
 * This controller contains functionality for the Joblist option in Navigation menu.
 * @requires $scope,$state,AppConfig,AuthService,TranslationService,SessionService
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
		 * @description Defines a page (subset of the translation strings) as specified by the page parameter on the $scope.
		 * @param {Integer} newPage - the page to retrieve
		 */
		$scope.paginate = function(newPage){
			$scope.data = _data.slice(((newPage-1) * $scope.viewConfig.pagination.itemsPerPage), ((newPage) * $scope.viewConfig.pagination.itemsPerPage))
		}

		$scope.paginate($scope.currentPage);

		// UPDATE
		/**
		 * @ngdoc method
		 * @name update
		 * @methodOf app.ontdekJouwTalent.controller:JoblistController
		 * @description Calls JoblistService.update to update job specified by id [NOT IMPLEMENTED YET]
		 * @param {Integer} id id of the job to update.
		 */
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
}]);
