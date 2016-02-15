angular.module('ontdekjouwtalent',[])

.controller('loginController', function($scope,$http){
	$scope.loginSubmit = function(){
		// zet de headers voor POST requests als FOR post ipv standaard de 'application/json'
		//$http.defaults.headers.post = {'Content-type':'application/x-www-form-urlencoded; charset=utf-8'}

		$http({
			method: 'GET',
			url: 'http://api-development.hrmatches.com/authenticate',
			data: {username: $scope.loginName, password:$scope.loginPassword}
		})
		.then(
			function(response){
				/*on success handler*/
				console.log(response);
				/*doe de standaard login*/
				$http({
					method:'POST',
					url: 'index.cfm?module=security&view=login&action=login',
					data:'j_username=' + $scope.loginName + '&j_password=' + $scope.loginPassword
				})
			},
			function(response){/* on error handler*/ console.log(response)}
		)
	}
	$scope.forgotPassword = function(){
		$http({
			method: 'POST',
			url: '',
			data: 'loginName=' + $scope.loginName
		}).then(
			function(response){/*on success handler*/ console.log(response)},
			function(response){/* on error handler*/ console.log(response)}
		);
	}
	$scope.register = function(){
		$http({
			method: 'POST',
			url: '',
			data: 'loginName=' + $scope.loginName + '&loginPassword=' + $scope.loginPassword
		}).then(
			function(response){/*on success handler*/ console.log(response)},
			function(response){/* on error handler*/ console.log(response)}
		);
	}
});