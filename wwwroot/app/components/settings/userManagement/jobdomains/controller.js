/**
 * @ngdoc controller
 * @name app.ontdekJouwTalent.controller:TeamsController
 * @description This controller contains functionality for Teams under 'Settings-Usermanagement '
 * @requires $scope,$state,AppConfig,settingsData,data,UserManagementService,SessionService
 * Referring states:'settings.userManagement.listTeams
 * */
angular.module('app.ontdekJouwTalent')
.controller('TeamsController',
	['$scope','$state','APIService','AppConfig','data','UserManagementService',
	function($scope,$state,APIService,AppConfig,data,UserManagementService) {
		$scope.selectedOption = 30;
		$scope.data = data;
		$scope.viewConfig = {
			"title": "Jobdomains",
			"columns": [{
				"visible": true,
				"columnName": AppConfig.API_ENDPOINTS.settings.userManagement.jobDomains.columnNames.displayName,
				"header_visible": false,
				"header_text": "",
				"cell_editable": false
			},{
				"visible": false,
				"columnName": AppConfig.API_ENDPOINTS.settings.userManagement.jobDomains.columnNames.id,
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
		$scope.confirmationText = $scope.TranslationService.getText('SETTINGS_CONFIRMATION');

		// ========== JOBDOMAIN LISTVIEW METHODS ==========
		// ADDJOBDOMAIN
		/**
		 * @ngdoc method
		 * @name addTeam
		 * @methodOf app.ontdekJouwTalent.controller:controller
		 * @description Called when user adds a jobdomain.
		 */
		$scope.addJobdomain = function(){
			$state.go('settings.userManagement.jobDomains');
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
			UserManagementService.deleteJobdomain(id)
			.then(
				function(successResponse){
					// NO STATE CORRESPONDS TO THIS ACTION, CALL TRACKDATA MANUALLY
					APIService.trackData('deleteJobdomain')
					.then(
						function(){
						// REFRESH JOBDOMAIN LIST
						$state.go('settings.userManagement.jobDomains',{},{reload:true});
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
		//TODO trackdata aanroepen
		$scope.edit = function(id){
			$state.go('settings.userManagement.detailJobdomain',{teamId:id})
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
			$state.go('settings.userManagement.jobDomains',{},{reload:true})
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
			UserManagementService.saveJobdomain(jobdomain)
			.then(
				function(successResponse){
					APIService.trackData('saveJobdomain')
					.then(
						function(){
							$state.go('settings.userManagement.jobDomains',{},{reload:true});
						}
					)
				}
			);
		}
		
	}]
);
