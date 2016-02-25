angular.module('app.HRMatches')
.directive('hrmLoginAdvertorial',function(){
	return{
		restrict: 'AE',
		scope: {
			config: '='
		},
		templateUrl:'/app/components/login/views/advertorial.html'
	}
});
