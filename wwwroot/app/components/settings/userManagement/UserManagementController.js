/**
 * @ngdoc controller
 * @name app.ontdekJouwTalent.controller:UserManagementController
 * @description This controller contains functionality for usermanagement under 'Settings'
 * @requires $scope,$state,UserManagementService
 * Referring states: 'settings.userManagement','settings.usermanagement.rightsAndRoles','settings.userManagement.teams
 * */
angular.module('app.ontdekJouwTalent')
.controller('UserManagementController',
	['$location','$scope','$state','menu','UserManagementService',
	function($location,$scope,$state,menu,UserManagementService) {
		$scope.tabs = [];
		/* TABS DATA */
		for(var i=0; i<menu.length; i++){
			$scope.tabs.push(
				{
					title: menu[i].title,
					url: menu[i].url,
					displayName: menu[i].displayName
				}
			);
		}

		// FIND ACTIVE TAB THAT CORRESPONDS TO CURRENT STATE
		$scope.activeTab = $scope.tabs.findIndex(function(el,ind,arr){
			if(el.url== $state.current.url){
				return ind;
			}
		})
		/*END TABS DATA */

		// EDIT
		/**
		 * @ngdoc method
		 * @name edit
		 * @methodOf app.ontdekJouwTalent.controller:UserManagementController
		 * @description
		 * Used in generic tableView.html to edit row content
		 *
		 */
		$scope.edit = function(id){
			console.log('edit(' + id + ')');
		}

		
		// GO
		/**
		 * @ngdoc method
		 * @name go
		 * @methodOf app.ontdekJouwTalent.controller:UserManagementController
		 * @description
		 * Used in views to transition to another state<br /><br />
		 * Dependencies: $state
		 *
		 */
		$scope.go = function(route){
			$state.go(route);
		};

		$scope.url = function(url) {
			$location.url(url);
		}

		// ASSIGNRIGHT
		/**
		 * @ngdoc method
		 * @name assignRight
		 * @methodOf app.ontdekJouwTalent.controller:UserManagementController
		 * @description
		 \* [ NOT IMPLEMENTED YET ]<br />
		 * Used in Settings.userManagement.RightsAndRoles to assign role-selected rights
		 *
		 */
		$scope.assignRight = function(data){
			UserManagementService.assignRight(data);
		}

	}]
);
