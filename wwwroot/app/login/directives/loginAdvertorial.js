angular.module('app.ontdekJouwTalent')
.directive('hrmLoginAdvertorial',function(){
	return{
		restrict: 'AE',
		scope: {
			config: '='
		},
		templateUrl:'/app/login/views/advertorial.html'
	}
});
