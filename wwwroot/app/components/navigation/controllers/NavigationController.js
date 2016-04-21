/*
 * NAVIGATION MODULE
 * date:		03 march 2016
 * 
 * view:	/app/shared/components/navigation/views/navigation.html
 * 
 * contains site wide navigation
 *  * 
 * */

angular.module('app.ontdekJouwTalent')
.controller('NavigationController',['$scope','$state','AuthService',function($scope,$state,AuthService){

	$scope.logout = function(){
		AuthService.logout()
			.then(
				null,
				function(errorResponse){
				console.log('error @ AuthService.logout(): ',errorResponse);
			});
		$state.go('logout');
	}

}])
