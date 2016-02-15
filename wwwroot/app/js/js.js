angular.module('ontdekjouwtalent',[])

.controller('loginController', function($scope,$http){
	$scope.loginSubmit = function(){
		// zet de headers voor POST requests als FOR post ipv standaard de 'application/json'
		$http.defaults.headers.post = {'Content-type':'application/x-www-form-urlencoded; charset=utf-8'}

		$http({
			method: 'POST',
			url: 'http://ontdekjouwtalent.local/login.cfm',
			data: 'loginName=' + $scope.loginName + '&loginPassword=' + $scope.loginPassword
		})
		.then(
		    function(response){/*on success handler*/ console.log(response)},
			function(response){/* on error handler*/ console.log(response)}
		)
	}
	$scope.forgotPassword = function(){
		$http({
			method: 'POST',
			url: '',
			data: 'loginName=' + $scope.loginName
		});
	}
	$scope.register = function(){
		$http({
			method: 'POST',
			url: '',
			data: 'loginName=' + $scope.loginName + '&loginPassword=' + $scope.loginPassword

		});
	}
});