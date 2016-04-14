angular.module('app.HRMatches')
.controller('UserManagementController',
	['$scope','$state','AppConfig','settingsData','data','UserManagementService','SessionService',
	function($scope,$state,AppConfig,settingsData,data,UserManagementService,SessionService) {

		$scope.data = data.data;
		$scope.viewConfig = data.configuration;
		$scope.AppConfig = AppConfig;

		/*TABS*/
		$scope.tabs = [
			{ heading: settingsData.settings.setting.userManagement.page.tabTitles.users, route:"settings.userManagement.gebruikers", active:false },
			{ heading: settingsData.settings.setting.userManagement.page.tabTitles.invited, route:"settings.userManagement.uitgenodigd", active:false },
			{ heading: settingsData.settings.setting.userManagement.page.tabTitles.rightsAndRoles, route:"settings.userManagement.rechtenEnRollen", active:true },
			{ heading: settingsData.settings.setting.userManagement.page.tabTitles.teams, route:"settings.userManagement.teams", active:false },
			{ heading: settingsData.settings.setting.userManagement.page.tabTitles.vacaturePool, route:"settings.userManagement.vacaturePool", active:false },
		];

		$scope.go = function(route){
			$state.go(route);
		};

		$scope.active = function(route){
			return $state.is(route);
		};

		$scope.$on("$stateChangeSuccess", function() {
			$scope.tabs.forEach(function(tab) {
				tab.active = $scope.active(tab.route);
			});
		});
		/*END TABS*/

		/*========== GEBRUIKERS ==========*/
		/*========== UITGENODIGD ==========*/
		/*========== RECHTEN EN ROLLEN ==========*/

		$scope.assignRight = function(data){
			UserManagementService.assignRight(data);
		}

		/*========== TEAMS ==========*/

		$scope.addTeam = function(id){
			console.log('Add ',id);
		}

		$scope.deleteTeam = function(id){
			console.log('Delete ',id);
		}

		/*========== VACATURE POOL==========*/
	}]
);
