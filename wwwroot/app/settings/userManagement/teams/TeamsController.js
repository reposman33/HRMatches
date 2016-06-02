/**
 * @ngdoc controller
 * @name app.ontdekJouwTalent.controller:TeamsController
 * @description This controller contains functionality for Teams under 'Settings-Usermanagement '
 * @requires $scope,$state,APIService,AppConfig,data,UserManagementService,SessionService
 * Referring states:'settings.userManagement.teams
 * */
angular.module('app.ontdekJouwTalent')
.controller('TeamsController',
	['$scope','$state','APIService','AppConfig','data','UserManagementService','SessionService',
	function($scope,$state,APIService,AppConfig,data,UserManagementService,SessionService) {
		<!--text to display when user clicks 'Delete' button for a team-->
		$scope.selectedOption = 30;
		$scope.data = data;
		if($scope.data.listView) {
			$scope.data.listView.configuration = {
				"title": "Teams",
				"columns": [{
					"visible": true,
					"columnName": AppConfig.API_ENDPOINTS.settings.userManagement.teams.columnNames.displayName,
					"header_visible": false,
					"header_text": "",
					"cell_editable": false
				}, {
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
		}
		$scope.deleteConfirmationText = $scope.TranslationService.getText('SETTINGS_CONFIRMATION');

		// ========== TEAM LISTVIEW METHODS ==========
		// ADDTEAM
		/**
		 * @ngdoc method
		 * @name addTeam
		 * @methodOf app.ontdekJouwTalent.controller:TeamsController
		 * @description Called when user adds a team.
		 */
		$scope.addTeam = function(){
			$state.go('settings.userManagement.teams.detail');
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
			APIService.call(AppConfig.API_ENDPOINTS.settings.userManagement.deleteTeam,{teamId:id})
			.then(
				function(successResponse){
					// NO STATE CORRESPONDS TO THIS ACTION, CALL TRACKDATA MANUALLY
					APIService.trackData('deleteTeam')
					.then(
						function(){
						// REFRESH TEAM LIST
						$state.go('settings.userManagement.teams',{},{reload:true});
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
			$state.go('settings.userManagement.teams.detail',{id:id})
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
			$state.go('settings.userManagement.teams',{},{reload:true})
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
			APIService.call(AppConfig.API_ENDPOINTS.settings.userManagement.addTeam,{teams:[team]})
			.then(
				function(successResponse){
					return APIService.trackData('saveTeam')
				}
			)
			.then(
				function(){
					$state.go('settings.userManagement.teams',{},{reload:true});
				}
			)

		}

		// DELETETEAMMEMBER
		/**
		 * @ngdoc method
		 * @name deleteTeamMember
		 * @methodOf app.ontdekJouwTalent.controller:TeamsController
		 * @description Delete a team member.
		 * @param {uuid} id id of teammember to delete
		 */
		$scope.deleteTeamMember = function(id){
			// DELETE TEAMMEMBER FROM MEMBER ARRAY
			for(var i=0; i<data.detailView.team.members.length; i++){
				if(data.detailView.team.members[i].personId == id){
					data.detailView.team.members.splice(i,1);
					break;
				}
			}
		}

		// ADDTEAMMEMBER
		/**
		 * @ngdoc method
		 * @name addTeamMember
		 * @methodOf app.ontdekJouwTalent.controller:TeamsController
		 * @description Adds a team member. No API resulting call, teammember is added to team members array
		 * @param {object} team member to add
		 */
		$scope.addTeamMember = function(newTeamMember){
			// retrieve user from users list
			for(var i=0; i<data.detailView.users.length; i++){
				if(data.detailView.users[i].id == newTeamMember.personId){
					var _newTeamMember = angular.copy(data.detailView.users[i]); //use angular.copy() to clone
					_newTeamMember.roleId = newTeamMember.roleId
					_newTeamMember.personId = newTeamMember.personId
					data.detailView.team.members.push(_newTeamMember);
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
