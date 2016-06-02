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
	['$scope','SessionService','MenuService',
		function($scope,SessionService,MenuService){

			MenuService.getMenu('TopNav')
			.then(
				function(successResponse){
					$scope.menus = successResponse.map(function(menu,ind,menus){
						menu.url = '#' + menu.url;
						return menu;
					});
				}
			)
		}
	]
)
