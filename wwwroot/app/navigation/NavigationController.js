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
	['$scope','AppConfig','SessionService','MenuService', function($scope,AppConfig,SessionService,MenuService){

		MenuService.getMenu('TopNav')
		.then(

			// FIRST append '#' before all ui href values
			function(successResponse){
				var menus = successResponse.map(function(menu,ind,menus){
					menu.url = '#' + menu.url;
					return menu;
				});

				// THEN when host == 'localhost' or 'ojt.hrmatches.com':
				// adapt state for 'Vacatures' (/jobs) to depend on user profile -
				// to differentiate between beheer and non-beheer user.
				// Instead of 2 separate menu items  - 'Vacatures' and 'HR Vacatures'
				// Needed as long as there is no separate beheer site.
				if(AppConfig.APPCONSTANTS_ISTEST || AppConfig.APPCONSTANTS_ISLOCAL){
					var currentUserProfile = SessionService.getCurrentUserProfile();
					$scope.menus = menus.map(
						function(menu){
							if(menu.url == '#/jobs' && currentUserProfile.domainName == "HR Domain"){
								menu.url = '#/HRvacatures';
							}
							return menu;
						}
					)
				}
			}
		)
	}]
);
