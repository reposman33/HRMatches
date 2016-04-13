angular.module('app.HRMatches')
.controller('UserManagementController',
	['$scope','$state','AppConfig','settingsData','UserManagementService','SessionService',
	function($scope,$state,AppConfig,settingsData,UserManagementService,SessionService) {
		// DUMMY DATA HERE
		$scope.settingsData = settingsData;
/*
		$scope.data = data.data; // dit is dummy data
        $scope.viewConfig = data.configuration;
*/
		$scope.AppConfig = AppConfig;
		$scope.showDetailView = false;

		$scope.assignRight = function(data){
	        UserManagementService.assignRight(data);
        }

		$scope.addTeam = function(id){
			$scope.fileLocations.teams = '/app/components/settings/userManagement/teams/views/detailView.html';
		}

		$scope.deleteTeam = function(id){

		}

		/*START TABS*/
		$scope.tabs = [
			{ heading: "Gebruikers", route:"settings.userManagement.gebruikers", active:false },
			{ heading: "Uitgenodigd", route:"settings.userManagement.uitgenodigd", active:false },
			{ heading: "Rechten en Rollen", route:"settings.userManagement.rechtenEnRollen", active:false },
			{ heading: "Teams", route:"settings.userManagement.teams", active:false },
			{ heading: "VacaturePool", route:"settings.userManagement.vacaturePool", active:false },
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
	}]
);
