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
		<!--text to display when user clicks 'Delete' button for a team-->
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
		$scope.confirmationText = $scope.TranslationService.getText('SETTINGS_CONFIRMATION');

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
					// NO STATE CORRESPONDS TO THIS ACTION, CALL TRACKDATA MANUALLY
					APIService.trackData('addTeam')
					.then(
						function(){
							// REFRESH TEAM LIST
							$state.go('settings.userManagement.detailTeam');
						}
					)
				}
			);
		}

		// DELETE
		/**
		 * @ngdoc method
		 * @name delete
		 * @methodOf app.ontdekJouwTalent.controller:TeamsController
		 * @parameters {Integer} id id of team to delete
		 * @description Called when user deletes a team.
		 */
		//TODO trackdata aanroepen
		$scope.delete = function(id){
			UserManagementService.deleteTeam(id)
			.then(
				function(successResponse){
					// NO STATE CORRESPONDS TO THIS ACTION, CALL TRACKDATA MANUALLY
					APIService.trackData('deleteTeam')
					.then(
						function(){
						// REFRESH TEAM LIST
						$state.go('settings.userManagement.listTeams',{},{reload:true});
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
		 * @description Called when user edits a team.
		 */
		//TODO trackdata aanroepen
		$scope.edit = function(id){
			$state.go('settings.userManagement.detailTeam',{teamId:id})
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
			$state.go('settings.userManagement.listTeams',{},{reload:true})
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
			.then(
				function(successResponse){
					APIService.trackData('saveTeam')
					.then(
						function(){
							$state.go('settings.userManagement.listTeams',{},{reload:true});
						}
					)
				}
			);
		}

		// DELETETEAMMEMBER
		/**
		 * @ngdoc method
		 * @name deleteTeamMember
		 * @methodOf app.ontdekJouwTalent.controller:TeamsController
		 * @description delete a team member. No API call, teammember is deleted from team MEMBERS array
		 * @param {uuid} id id of teammember to delete
		 */
		$scope.deleteTeamMember = function(id){
			// DELETE TEAMMEMBER FROM MEMBER ARRAY
			for(var i=0; i<data.team.MEMBERS.length; i++){
				if(data.team.MEMBERS[i].personId == id){
					data.team.MEMBERS.splice(i,1);
					break;
				}
			}
			$scope.saveTeam(data.team)
			.then(
				function(successResponse){
					APIService.trackData('deleteTeamMember')
					.then(
						function(){
							$state.go('settings.userManagement.listTeams',{},{reload:true});
						})
				}
			);
		}

		// ADDTEAMMEMBER
		/**
		 * @ngdoc method
		 * @name addTeamMember
		 * @methodOf app.ontdekJouwTalent.controller:TeamsController
		 * @description adds a team member. No API call, teammember is added to team MEMBERS array
		 * @param {object} team member to add
		 */
		$scope.addTeamMember = function(newTeamMember){
			// retrieve user from users list
			for(var i=0; i<data.users.length; i++){
				if(data.users[i].id == newTeamMember.personId){
					var _newTeamMember = angular.copy(data.users[i]); //use angular.copy() to clone
					_newTeamMember.roleId = newTeamMember.roleId
					_newTeamMember.personId = newTeamMember.personId
					data.team.MEMBERS.push(_newTeamMember);
					break;
				}
			}
			// reset select to '-- select teammember --' and '-- select role --'
			$scope.newUser.roleId = "";
			$scope.newUser.personId = "";

			APIService.trackData('addTeamMember');
		}
	}]
);
