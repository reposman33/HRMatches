/**
 * @ngdoc controller
 * @name app.ontdekJouwTalent.controller:SettingsController
 * @description
 * This controller contains common functionality for Settings.<br /><br />
 * Dependencies: $scope,settingsData<br />
 * Referring states: 'settings'
 * */
angular.module('app.ontdekJouwTalent')
.controller('SettingsController',
	['$scope','settingsData',
    function($scope,settingsData) {

		// DUMMY DATA HERE
        $scope.settingsData = settingsData;
    }
])
