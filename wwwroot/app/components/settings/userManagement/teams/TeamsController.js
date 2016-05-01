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
		$scope.selectedOption = 30;
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

		// ========== TEAM LISTVIEW METHODS ==========
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
		//TODO trackdata aanroepen
		$scope.delete = function(id){
			UserManagementService.deleteTeam(id)
			.then(
			function(successResponse){
				$state.go('settings.userManagement.listTeams',{},{reload:true});
			}
			);
		}

		// EDIT
		/**
		 * @ngdoc method
		 * @name edit
		 * @methodOf app.ontdekJouwTalent.controller:TeamsController
		 * @parameters {uuid} id id of team to edit
		 * @description Called when user edits a team.
		 */
		//TODO trackdata aanroepen
		$scope.edit = function(id){
			$state.go('settings.userManagement.detailTeam',{teamId:id});
		}


		// ========== TEAM DETAILVIEW METHODS ==========
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

		// SAVETEAM
		/**
		 * @ngdoc method
		 * @name saveTeam
		 * @methodOf app.ontdekJouwTalent.controller:TeamsController
		 * @parameters {uuid} id id of team to save
		 * @description Called when user edits a team and clicks 'Save'.
		 */
		$scope.saveTeam = function(team){
			UserManagementService.saveTeam(team)
		}

		/**
		 * @ngdoc method
		 * @name deleteTeamMember
		 * @methodOf app.ontdekJouwTalent.controller:TeamsController
		 * @parameters {uuid} id id of teammember to delete
		 * @description Called when user edits a team and deletes a member.
		 */
		//TODO method deleteTeamMember() implementeren
		$scope.deleteTeamMember = function(id){

		}

		/**
		 * @ngdoc method
		 * @name addTeamMember
		 * @methodOf app.ontdekJouwTalent.controller:TeamsController
		 * @parameters {object} newTeamMember new teammember to add
		 * @description Called when user edits a team and adds a new member.
		 */
		//TODO method addTeamMember() implementeren
		$scope.addTeamMember = function(newTeamMember){

		}
	}]
);
