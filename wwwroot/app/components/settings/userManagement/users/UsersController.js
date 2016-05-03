/**
 * @ngdoc controller
 * @name app.ontdekJouwTalent.controller:UsersController
 * @description This controller contains functionality for Users under 'Settings-Usermanagement '
 * @requires $scope
 * Referring states:'settings.userManagement.listUsers'
 * */
angular.module('app.ontdekJouwTalent')
.controller('UsersController',
	['$scope','$state','data','UserManagementService','APIService',
	function($scope,$state,data,UserManagementService,APIService) {

		$scope.data = data; // REFERRED TO IN LISTVIEW
		$scope.newUser = data; // REFERRED TO IN DETAILVIEW

		// ========== USER LISTVIEW METHODS ==========

		// SAVEUSER
		/**
		 * @ngdoc method
		 * @name saveUser
		 * @methodOf app.ontdekJouwTalent.controller:UsersController
		 * @description Called when a user is added.
		 */
		$scope.saveUser = function(newUser){
			UserManagementService.addUser(newUser)
			.then(
				function(successResponse){
					// NO STATE CORRESPONDS TO THIS ACTION, CALL TRACKDATA MANUALLY
					APIService.trackData('saveUser')
					.then(
						function(){
							// REFRESH TEAM LIST
							$state.go('settings.userManagement.listUsers');
						})
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
