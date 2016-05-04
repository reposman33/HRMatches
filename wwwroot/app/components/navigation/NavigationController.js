/**
 * @ngdoc controller
 * @name app.ontdekJouwTalent.controller:NavigationController
 * @description
 * This controller contains functionality for the navigation bar.
 * @requires $scope,SessionService
 * Referring states:
 * */
angular.module('app.ontdekJouwTalent')
.controller('NavigationController',
	['$scope','SessionService',
		function($scope,SessionService){

			$scope.currentUserProfile = SessionService.getCurrentUserProfile();
			$scope.username = SessionService.get('username');

		}
	]
)
