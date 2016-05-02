/**
 * @ngdoc controller
 * @name app.ontdekJouwTalent.controller:UserManagementController
 * @description This controller contains functionality for usermanagement under 'Settings'
 * @requires $scope,$state,AppConfig,settingsData,data,UserManagementService,SessionService
 * Referring states: 'settings.userManagement','settings.userManagement.rechtenEnRollen','settings.userManagement.listTeams
 * */
angular.module('app.ontdekJouwTalent')
.controller('UserManagementController',
	['$scope','$state','AppConfig','settingsData','data','UserManagementService','SessionService',
	function($scope,$state,AppConfig,settingsData,data,UserManagementService,SessionService) {
		$scope.data = data;
		$scope.AppConfig = AppConfig;

		/* TABS DATA */
		$scope.tabs = [
			{ heading: settingsData.settings.setting.userManagement.page.tabTitles.users, route:"settings.userManagement.listUsers" },
			{ heading: settingsData.settings.setting.userManagement.page.tabTitles.invited, route:"settings.userManagement.uitgenodigd"},
			{ heading: settingsData.settings.setting.userManagement.page.tabTitles.rightsAndRoles, route:"settings.userManagement.rechtenEnRollen"},
			{ heading: settingsData.settings.setting.userManagement.page.tabTitles.teams, route:"settings.userManagement.listTeams"},
			{ heading: settingsData.settings.setting.userManagement.page.tabTitles.vacaturePool, route:"settings.userManagement.vacaturePool"}
		];

		// FIND ACTIVE TAB THAT CORRESPONDS TO CURRENT STATE
		$scope.activeTab = $scope.tabs.findIndex(function(el,ind,arr){
			if(el.route == $state.$current.name){
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

		/*========== GEBRUIKERS ==========*/
		/*========== UITGENODIGD ==========*/
		/*========== RECHTEN EN ROLLEN ==========*/

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

		/*========== TEAMS ==========*/


		/*========== VACATURE POOL==========*/
	}]
);
