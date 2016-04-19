angular.module('app.HRMatches')
.controller('UserManagementController',
	['$scope','$state','AppConfig','settingsData','data','UserManagementService','SessionService',
	function($scope,$state,AppConfig,settingsData,data,UserManagementService,SessionService) {

		$scope.data = data.data;
		$scope.viewConfig = data.configuration;
		$scope.AppConfig = AppConfig;

		$scope.edit = function(id){
			console.log('edit(' + id + ')');
		}

		$scope.delete = function(id){
			console.log('delete(' + id + '))');
		}

		/*TABS*/
		$scope.tabs = [
			{ heading: settingsData.settings.setting.userManagement.page.tabTitles.users, route:"settings.userManagement.gebruikers" },
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

		$scope.go = function(route){
			$state.go(route);
		};
		/*END TABS*/

		/*========== GEBRUIKERS ==========*/
		/*========== UITGENODIGD ==========*/
		/*========== RECHTEN EN ROLLEN ==========*/

		$scope.assignRight = function(data){
			UserManagementService.assignRight(data);
		}

		/*========== TEAMS ==========*/


		/*========== VACATURE POOL==========*/
	}]
);
