/**
 * @ngdoc controller
 * @name app.ontdekJouwTalent.controller:TeamsController
 * @description This controller contains functionality for Teams under 'Settings-Usermanagement '
 * @requires $scope,$state,AppConfig,settingsData,data,UserManagementService,SessionService
 * Referring states:'settings.userManagement.listTeams
 * */
angular.module('app.ontdekJouwTalent')
.controller('TeamsController',
	['$scope','$state','AppConfig','data','UserManagementService',
	function($scope,$state,AppConfig,data,UserManagementService) {

		$scope.data = data;
		$scope.viewConfig = {
			"title": "Teams",
			"columns": [{
				"visible": true,
				"columnName": AppConfig.API_ENDPOINTS.settings.userManagement.teams.columnNames.displayName,
				"header_visible": false,
				"header_text": "",
				"cell_editable": false
			},{
				"visible": false,
				"columnName": AppConfig.API_ENDPOINTS.settings.userManagement.teams.columnNames.id,
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

		// CANCEL
		/**
		 * @ngdoc method
		 * @name cancel
		 * @methodOf app.ontdekJouwTalent.controller:TeamsController
		 * @description Called when user cancels the teams detailswindow and is redirected to teams listView.
		 */
		$scope.cancel = function(){
			$state.go('settings.userManagement.listTeams',{},{reload:true});
		}

		// ADDTEAM
		/**
		 * @ngdoc method
		 * @name addTeam
		 * @methodOf app.ontdekJouwTalent.controller:TeamsController
		 * @description Called when user addTeam a team.
		 */
		$scope.addTeam = function(){
			UserManagementService.addTeam()
			.then(
			function(successResponse){
				$state.go('settings.userManagement.listTeams',{},{reload:true});
			}
			);
		}

		// DELETE
		/**
		 * @ngdoc method
		 * @name deleteTeam
		 * @methodOf app.ontdekJouwTalent.controller:TeamsController
		 * @parameters {Integer} id id of team to delete
		 * @description Called when user deletes a team.
		 */
		$scope.delete = function(id){
			UserManagementService.deleteTeam(id)
			.then(
				function(successResponse){
					return successResponse;
				}
			)
		}

		// EDIT
		/**
		 * @ngdoc method
		 * @name edit
		 * @methodOf app.ontdekJouwTalent.controller:TeamsController
		 * @parameters {uuid} id id of team to edit
		 * @description Called when user edits a team.
		 */
		$scope.edit = function(id){
			$state.go('settings.userManagement.detailTeam',{teamId:id});
		}
	}]
);
