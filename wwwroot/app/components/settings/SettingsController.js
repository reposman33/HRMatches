angular.module('app.HRMatches')
.controller('SettingsController', ['$scope','settingsData',
    function($scope,settingsData) {
        // DUMMY DATA HERE
        $scope.settingsData = settingsData;
    }
])
