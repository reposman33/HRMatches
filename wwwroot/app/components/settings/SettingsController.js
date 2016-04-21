angular.module('app.ontdekJouwTalent')
.controller('SettingsController', ['$scope','settingsData',
    function($scope,settingsData) {
        // DUMMY DATA HERE
        $scope.settingsData = settingsData;
    }
])
