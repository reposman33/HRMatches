/**
 * @ngdoc controller
 * @name app.ontdekJouwTalent.controller:JobsController
 * @description
 * This controller contains functionality for the Joblist option in Navigation menu.
 * @requires $scope,$state,AppConfig,AuthService,TranslationService,SessionService
 * Referring states: 'jobs'
 **/
angular.module('app.ontdekJouwTalent')
.controller('JobsController',
	['$scope','APIService','AppConfig','data','filterFilter','JobsService','SessionService',
	function($scope,APIService,AppConfig,data,filterFilter,JobsService,SessionService){

		$scope.data = {};
		$scope.data.jobs = data.jobs;

		// INITIALIZEJOBS
		/**
		 * @ngdoc method
		 * @name initializeJobs
		 * @methodOf app.ontdekJouwTalent.controller:JobsController
		 * @description initialize the jobs listview
		 */
		function initializeListView(){
			$scope.data.configuration = {
				columns:[{}]
				,pagination:{
					enable:true,
					maxSize:10,
					itemsPerPage:1
				}
			}
			$scope.viewConfig = data.configuration;
			$scope.totalItems = data.jobs.length;
			$scope.currentPage = 1;
			$scope.jobFilters = [];

			/* 'COUNTRY' SELECT SHOWS ONLY COUNTRIES IN JOBS*/
			// retrieve all countryIds from jobs
			var countryIds = data.jobs.map(
				function(job,index,jobs){
					return job.countryId;
				}
			);
			// filter countries by jobs
			var countries = data.countries.filter(
				function(country,index,countries){
					return this.countryIds.indexOf(country.id) > -1;
				},
				{'countryIds':countryIds}
			)
			$scope.data.countries = countries;

			/* 'AFDELING' SELECT SHOWS ONLY REFERENCES IN JOBS*/
			 // retrieve all referenceCodes from jobs
			 var referenceCodes = data.jobs.map(
				function(job,index,jobs){
					return job.referenceCode;
				}
			);
			 // filter references by jobs
			 var references = data.references.filter(
				function(reference,index,references){
					return this.referenceCodes.indexOf(reference.id) > -1;
				},
				{'referenceCodes':referenceCodes}
			 )
			$scope.data.references = references;

			//$scope.paginate($scope.currentPage);
		}


		// INITIALIZEDETAILVIEW
		/**
		 * @ngdoc method
		 * @name initializeDetailView
		 * @methodOf app.ontdekJouwTalent.controller:JobsController
		 * @description initializations specific for displaying detail info screen
		 */
		function initializeDetailView(){
			for(var i=0; i<data.countries.length; i++){
				if(data.countries[i].id == data.job.countryId){
					$scope.countryName = data.countries[i].countryName;
				}
			}
		}

		  // PAGINATE
		 /**
		  * @ngdoc method
		  * @name paginate
		  * @methodOf app.ontdekJouwTalent.controller:JobsController
		  * @description paginate tableview
		  * @param {Integer} newPage page to display.
		  */
		$scope.paginate = function(newPage){
			$scope.data.jobs = data.jobs.slice(((newPage-1) * $scope.viewConfig.pagination.itemsPerPage), ((newPage) * $scope.viewConfig.pagination.itemsPerPage))
		}

			$scope.pageChanged = function() {
				console.log('Page changed to: ' + $scope.currentPage);
			};

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

		$scope.filterJobs = function(filterKey,filterValue){
			// remove filter with same filterKey
			$scope.jobFilters = $scope.jobFilters.filter(function(filter){
				 return filter[filterKey] == undefined;
			 })
			 // add filterKey
			 var newFilter = {};
			 newFilter[filterKey] = filterValue;
			 $scope.jobFilters.push(newFilter);
		 }

		$scope.resetJobFilters = function() {
			$scope.organisationFilter =
			$scope.countryFilter =
			$scope.referenceFilter =
			$scope.descriptionFilter = {};
			//reset selects
			$scope.job.organisation = '';
			$scope.job.country = '';
			$scope.job.reference = '';
			$scope.searchQuery = '';
		}

		// DO INITIALIZATINS FOR JOBS LISTVIEW
		if(data.jobs != undefined){
			initializeListView();
		}
		else if(data.job != undefined){
			initializeDetailView();
		}


		$scope.getCountryByCountryId = function(countryId){
			APIService.call(AppConfig.API_ENDPOINTS.country,{id:countryId})
			.then(
			function(successResponse){
				return successResponse.countryName;
			})
		}

		//format hours from '24,40' to '24 - 40 uren/week'
		$scope.formatHours = function(hours){
			var hours = hours.split(',');
			return hours[0] +' - '+ hours[1];
		}

	}]
);
