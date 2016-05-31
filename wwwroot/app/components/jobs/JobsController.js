/**
 * @ngdoc controller
 * @name app.ontdekJouwTalent.controller:JobsController
 * @description
 * This controller contains functionality for the Joblist option in Navigation menu.
 * @requires $scope,$state,AppConfig,AuthService,TranslationService,SessionService
 * Referring states: 'jobs'
 * */
angular.module('app.ontdekJouwTalent')
.controller('JobsController',
	['filterFilter','$scope','AppConfig','JobsService','data','SessionService',
	 function(filterFilter,$scope,AppConfig,JobsService,data,SessionService){

		data.configuration = {
			columns:[{
			 }]
			 ,pagination:{
				 enable:true,
				 maxSize:10,
				 itemsPerPage: 25,
				 itemsPerPage:15
			 }
		 }
		$scope.data = {};
		$scope.countries = data.countries;
		$scope.viewConfig = data.configuration;
		$scope.totalItems = data.length;
		$scope.currentPage = 1;

		// PAGINATE
		/**
		 * @ngdoc method
		 * @name paginate
		 * @methodOf app.ontdekJouwTalent.controller:JobsController
		 * @description Defines a page (subset of the translation strings) as specified by the page parameter on the $scope.
		 * @param {Integer} newPage - the page to retrieve
		 */
		$scope.paginate = function(newPage){
				$scope.data.jobs = data.jobs.slice(((newPage-1) * $scope.viewConfig.pagination.itemsPerPage), ((newPage) * $scope.viewConfig.pagination.itemsPerPage))
		}

		$scope.paginate($scope.currentPage);

		// UPDATE
		/**
		 * @ngdoc method
		 * @name update
		 * @methodOf app.ontdekJouwTalent.controller:JobsController
		 * @description Calls JobsService.update to update job specified by id [NOT IMPLEMENTED YET]
		 * @param {Integer} id id of the job to update.
		 */
		$scope.update = function(data){
			JobsService.update(data)
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
