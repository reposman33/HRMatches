/**
 * @ngdoc controller
 * @name app.ontdekJouwTalent.controller:UsersController
 * @description This controller contains functionality for Users under 'Settings-Usermanagement '
 * @requires $scope
 * Referring states:'settings.userManagement.listUsers'
 * */
angular.module('app.ontdekJouwTalent')
.controller('UsersController',
	['$scope','data','UserManagementService','APIService',
	function($scope,data,UserManagementService,APIService) {
		$scope.data = data;
		$scope.confirmationText = $scope.TranslationService.getText('SETTINGS_CONFIRMATION');

		// ========== USER LISTVIEW METHODS ==========

		// ADDTEAM
		/**
		 * @ngdoc method
		 * @name addTeam
		 * @methodOf app.ontdekJouwTalent.controller:TeamsController
		 * @description Called when user addTeam a team.
		 */
		$scope.addUser = function(){
			UserManagementService.addTeam()
			.then(
				function(successResponse){
					// NO STATE CORRESPONDS TO THIS ACTION, CALL TRACKDATA MANUALLY
					APIService.trackData('addTeam')
					.then(
						function(){
							// REFRESH TEAM LIST
							$state.go('settings.userManagement.listTeams',{},{reload:true});
						}
					)
				}
			);
		}

		// DELETEUSER
		/**
		 * @ngdoc method
		 * @name deleteUser
		 * @methodOf app.ontdekJouwTalent.controller:UsersController
		 * @parameters {Integer} id id of user to delete
		 * @description Called when user deletes a user from listView.
		 */
		$scope.deleteUser = function(id){
			UserManagementService.deleteUser(id)
			.then(
				function(successResponse){
					// NO STATE CORRESPONDS TO THIS ACTION, CALL TRACKDATA MANUALLY
					APIService.trackData('deleteUser')
					.then(
						function(){
							// REFRESH TEAM LIST
							$state.go('settings.userManagement.listUsers',{},{reload:true});
						})
				}
			);
		}

	}]
);
