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

        $scope.menu = menu;

    }
])
