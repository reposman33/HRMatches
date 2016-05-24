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
	['$scope','AppConfig','JobsService','data','SessionService',
	 function($scope,AppConfig,JobsService,data,SessionService){

/*
 {
 "contractType": "",
 "educationTypeId": "03d2f673-6f0f-44d4-b044-1c520b0b2023",
 "contractTypeId": "ad3eda8d-71fd-4a0e-8306-05c9f3a08f8c",
 "jobStatus": 1,
 "latitude": 51.495053000000,
 "jobExperienceId": "3a93e23c-88a6-4159-bad8-49cb31aeb7fb",
 "tasks": "<p>&nbsp;• Bachelor degree;&nbsp;<\/p>\r\n\r\n<p>• A proven track record with Supply Chain operations is a must;<\/p>\r\n\r\n<p>• Practical experience of responding to or managing RFPs;<\/p>\r\n\r\n<p>• Strong experience in warehousing<\/p>\r\n\r\n<p>• Able to deal tactfully with vendors, suppliers and contractors providing a broad spectrum of products and services;<\/p>\r\n\r\n<p>• Well able to continually suggest and investigate improved products, features, services, processes and business models;<\/p>\r\n\r\n<p>• Exemplary communication skills, both written and verbal;<\/p>\r\n\r\n<p>• Goal orientated approach; drive and energy to achieve desired results;<\/p>\r\n\r\n<p>• Self-motivated and able to work independently and as part of a team;<\/p>\r\n\r\n<p>• Very detailed oriented and excellent analytical abilities;<\/p>\r\n\r\n<p>• Excellent management, organizational and prioritization skills; able to execute several projects simultaneously;<\/p>\r\n\r\n<p>• Experience with Oracle is required;<\/p>\r\n\r\n<p>• Fluent in English, Dutch is preferred.<\/p>\r\n\r\n<p>&nbsp;<\/p>\r\n",
 "jobLevelId": "9dfe26e7-314f-431d-8ad8-6719c4212c13",
 "salary": "",
 "startDate": "2015-09-30",
 "jobCategoryId": "2c30e802-8109-424e-9faa-b27209c85c7e",
 "conditions": "<p>&nbsp;• Fast Growing and financially healthy company;&nbsp;<\/p>\r\n\r\n<p>• Informal, professional environment;<\/p>\r\n\r\n<p>• International colleagues\/ customers\/ partners;<\/p>\r\n\r\n<p>• Excellent package of employment terms; including competitive salary, 13th month and sales incentive plan;<\/p>\r\n\r\n<p>• Educational and personal development opportunities;<\/p>\r\n\r\n<p>• Flexibility in working hours;<\/p>\r\n\r\n<p>• Company parties, annual ski trip, Friday drinks<\/p>\r\n\r\n<p>&nbsp;<\/p>\r\n",
 "id": "4babd902-d17c-49d6-a5af-5ae5d933bcf5",
 "deleted": "",
 "jobTypeId": 1,
 "jobLanguage": "nl_NL",
 "instructions": "",
 "name": "Supply Chain Manager",
 "description": "<p>Are you an Expert in Supply Chain Management? Are you typically more a ‘Builder’ than a ‘Maintainer’ and do you consider it challenging and exciting to set up this new function within STS? Do you fit in an informal, professional and international corporate culture with short communication lines? Then we have a unique senior position for you at STS!<\/p>\r\n\r\n<p><strong>What this job is all about?<\/strong><\/p>\r\n\r\n<p>• Manage the Supply Chain activities concerning Point of Sale terminals; from the supply and inventory management to the management of the 3rd party logistics providers.&nbsp;<\/p>\r\n\r\n<p>• Design and implement processes in order to improve the customer experience and reduce cost.&nbsp;<\/p>\r\n\r\n<p>• Build and manage effective relationships with suppliers and sales partners.&nbsp;<\/p>\r\n\r\n<p>• Resolve daily issues related to terminal deployment<\/p>\r\n\r\n<p>&nbsp;<\/p>\r\n\r\n<p>&nbsp;<\/p>\r\n",
 "referenceCode": "",
 "address": "",
 "ticketId": 199,
 "secondName": "",
 "publishDate": "January, 01 2015 00:00:00",
 "salaryType": 1,
 "expireDate": "",
 "created": "September, 30 2015 11:32:40",
 "publishStatus": 1,
 "zipcode": "NW1",
 "countryId": "NL",
 "brancheId": "83293d14-71e6-4947-9b08-8a3b6eb5bd3c",
 "updated": "April, 25 2016 13:06:17",
 "applyLink": "http:\/\/demo.hrmatches.com\/index.cfm?module=joboverview&view=jobdetails&jobId=4BABD902-D17C-49D6-A5AF-5AE5D933BCF5&lang=nl_NL",
 "longitude": 4.282931900000,
 "city": "London",
 "organisation": "STS Ltd.",
 "hours": "36,40"
 }
* */

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
