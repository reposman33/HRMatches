/**
 * @ngdoc controller
 * @name app.ontdekJouwTalent.controller:UsersController
 * @description This controller contains functionality for Users under 'Settings-Usermanagement '
 * @requires $scope
 * Referring states:'settings.userManagement.listUsers'
 * */
angular.module('app.ontdekJouwTalent')
.controller('UsersController',
	['$scope','$state','AppConfig','data','UserManagementService','APIService',
	function($scope,$state,AppConfig,data,UserManagementService,APIService) {

		$scope.data = data; // REFERRED TO IN LISTVIEW
		$scope.newUser = data; // REFERRED TO IN DETAILVIEW
		$scope.confirmDeleteUserText = $scope.TranslationService.getText('SETTINGS_CONFIRMATION');
		// ========== USER LISTVIEW METHODS ==========

		// SAVEUSER
		/**
		 * @ngdoc method
		 * @name saveUser
		 * @methodOf app.ontdekJouwTalent.controller:UsersController
		 * @description Called from 'Add user' screen when a user is added.
		 */
		$scope.saveUser = function(newUser){
			APIService.call(AppConfig.API_ENDPOINTS.settings.userManagement.addUser,{person:newUser})
			.then(
				function(successResponse) {
					APIService.trackData('saveUser');
				}
			)
			.then(
				function(){
					// REFRESH USER LISTVIEW
					$state.go('settings.userManagement.listUsers');
				}
			)
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
			APIService.call(AppConfig.API_ENDPOINTS.settings.userManagement.deleteUser,{personId:id})
			.then(
				function(successResponse){
					APIService.trackData('deleteUser')
				}
			)
			.then(
				function(){
				// REFRESH USER LISTVIEW
				$state.go('settings.userManagement.listUsers',{},{reload:true});
			})
		}
	}]
);
