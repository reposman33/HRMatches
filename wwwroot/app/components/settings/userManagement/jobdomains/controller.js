/**
 * @ngdoc controller
 * @name app.ontdekJouwTalent.controller:JobdomainsController
 * @description This controller contains functionality for Jobdomains under 'Settings-Usermanagement '
 * @requires $scope,$state,AppConfig,settingsData,data,UserManagementService,SessionService
 * Referring states:'settings.userManagement.jobdomains
 * */
angular.module('app.ontdekJouwTalent')
.controller('JobdomainsController',
	['$scope','$state','APIService','AppConfig','data','SessionService','UserManagementService',
	function($scope,$state,APIService,AppConfig,data,SessionService,UserManagementService) {
		$scope.selectedOption = 30;
		$scope.data = data;

		// TEAMS ARRAY FOR A SINGLE JOBDOMAIN CONTAINS OBJECTS {NAME,ID}. WE ONLY NEED IDS FOR THE MULTIPLE SELECT SO CHANGE THAT HERE
		if(data.detailView && data.detailView.jobDomain!= undefined){
			$scope.data.detailView.jobDomain.teams = data.detailView.jobDomain.teams.map(function(currentValue, index,teams){
				return currentValue.id;
			});
		}

		$scope.deleteConfirmationText = $scope.TranslationService.getText('SETTINGS_CONFIRMATION');
		if($scope.data.listView){
			$scope.data.listView.configuration = {
				"title": "Jobdomains",
				"columns": [{
					"visible": true,
					"columnName": AppConfig.API_ENDPOINTS.settings.userManagement.jobdomains.columnNames.displayName,
					"header_visible": false,
					"header_text": "",
					"cell_editable": false
				},{
					"visible": false,
					"columnName": AppConfig.API_ENDPOINTS.settings.userManagement.jobdomains.columnNames.id,
					"header_visible": false,
					"header_text": "",
					"cell_editable": false
				}
					,{
						"visible": false,
						"columnName": AppConfig.API_ENDPOINTS.settings.userManagement.jobdomains.columnNames.id,
						"header_visible": false,
						"header_text": "",
						"cell_editable": false
					}
				],
				"row_editable": true,
				"pagination": {
					"enable": false,
					"itemsPerPage": 15,
					"maxSize": 10
				}
			}
		}

		// ========== JOBDOMAIN LISTVIEW METHODS ==========
		// ADDJOBDOMAIN
		/**
		 * @ngdoc method
		 * @name addJobdomain
		 * @methodOf app.ontdekJouwTalent.controller:JobdomainsController
		 * @description Called when user adds a jobdomain.
		 */
		$scope.addJobdomain = function(){
			$state.go('settings.userManagement.jobdomain');
		}

		// DELETE
		/**
		 * @ngdoc method
		 * @name delete
		 * @methodOf app.ontdekJouwTalent.controller:TeamsController
		 * @parameters {Integer} id id of team to delete
		 * @description Called when user deletes a jobdomain.
		 */
		//TODO trackdata aanroepen
		$scope.delete = function(id){
			UserManagementService.deleteJobdomain('jobdomains','DELETE',{jobDomainId:id})
			.then(
				function(successResponse){
					// NO STATE CORRESPONDS TO THIS ACTION, CALL TRACKDATA MANUALLY
					APIService.trackData('deleteJobdomain')
					.then(
						function(){
						// REFRESH JOBDOMAIN LIST
						$state.go('settings.userManagement.jobdomains',{},{reload:true});
					})
				}
			);
		}

		// EDIT
		/**
		 * @ngdoc method
		 * @name edit
		 * @methodOf app.ontdekJouwTalent.controller:TeamsController
		 * @parameters {uuid} id id of team to edit
		 * @description Called when user edits a jobdomain.
		 */
		$scope.edit = function(id){
			$state.go('settings.userManagement.jobdomain',{id:id})
		}


		// ========== JOBDOMAIN DETAILVIEW METHODS ==========
		// CANCEL
		/**
		 * @ngdoc method
		 * @name cancel
		 * @methodOf app.ontdekJouwTalent.controller:TeamsController
		 * @description Called when user cancels the teams detailswindow and is redirected to teams listView.
		 */
		$scope.cancel = function(){
			$state.go('settings.userManagement.jobdomains',{},{reload:true})
		}

		// SAVEJOBDOMAIN
		/**
		 * @ngdoc method
		 * @name saveTeam
		 * @methodOf app.ontdekJouwTalent.controller:TeamsController
		 * @parameters {uuid} id id of team to save
		 * @description Called when user edits a jobdomain and clicks 'Save'.
		 */
		$scope.saveJobdomain = function(jobdomain){
			UserManagementService.saveJobdomain(
				AppConfig.API_ENDPOINTS.settings.userManagement.jobdomains.endpoint,
				jobdomain.id.length > 1 ? 'PUT' : 'POST',
				{jobdomains:[jobdomain]}
			)
			.then(
				function(successResponse){
					APIService.trackData('saveJobdomain')
					.then(
						function(){
							$state.go('settings.userManagement.jobdomains',{},{reload:true});
						}
					)
				}
			);
		}
		
	}]
);
