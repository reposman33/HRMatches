/**
 * @ngdoc controller
 * @name app.ontdekJouwTalent.controller:SettingsController
 * @description This controller contains common functionality for Settings.
 * @requires $scope,settingsData
 * Referring states: 'settings'
 * */
angular.module('app.ontdekJouwTalent')
.controller('SettingsController',
	['$scope','menu',
    function($scope,menu) {
		$scope.styles = {
			'/settings/myaccount': 'fa fa-user fa-fw',
			'/settings/mycompany': 'fa fa-building-o fa-fw',
			'/settings/userManagement': 'fa fa-users fa-fw',
			'/settings/tagmanagement': 'fa fa-tags fa-fw',
			'/settings/doctemplates': 'fa fa-files-o fa-fw',
			'/settings/references': 'fa fa-th fa-fw',
			'/settings/matching': 'fa fa-tasks  fa-fw'
		}

        $scope.menu = menu;

    }
])
