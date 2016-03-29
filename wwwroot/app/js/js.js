/*angular.module('app.HRMatches',[])
.factory('config',function(){

	return{
		// login authenticatie url
		APPCONSTANTS_login_api2_url: 'http://api2.in2cv.nl/index.cfm?endpoint=%2Fauthenticate',
		// feedback tekst voor login
		APPCONSTANTS_login_success_feedback_text: 'U bent succesvol ingelogd!',
		APPCONSTANTS_login_notauth_feedback_text: 'Authenticatie error:',
		APPCONSTANTS_login_error_feedback_text: 'LOGIN ERROR:',
		APPCONSTANTS_login_nocredentials_feedback_text: 'Email adres en wachtwoord invullen a.u.b.',
		// feedback classes voor login
		APPCONSTANTS_login_success_feedback_class: 'col-md-8 alert alert-success',
		APPCONSTANTS_login_notauth_feedback_class: 'col-md-8 alert alert-danger',
		APPCONSTANTS_login_error_feedback_class: 'col-md-8 alert alert-danger',
		APPCONSTANTS_login_nocredentials_feedback_class: 'col-md-8 alert alert-warning',
	}
})
.directive('login',['$http',function($http){
	return {
		restrict: 'A',
		scope: {},
		link: function($scope,elem,attr){
		},
		templateUrl: '/app/views/login.html',

		controller: ['$scope','config',function($scope,config){
			$scope.loginSubmit = function(){
				var loginName = $scope.loginName || "";
				var password = $scope.loginPassword || "";
				if(loginName && password){
					$http({
						//headers:{'Content-Type','application/json'},
						method: 'POST',
						url: config.APPCONSTANTS_login_api2_url,
						data: {username: $scope.loginName, password:$scope.loginPassword, deviceId:''}
					})
					.then(
						function(response){
							if(response.data.token && response.data.token.length > 0){
								//doe de standaard login
								$scope.loginFeedbackClass = config.APPCONSTANTS_login_success_feedback_class;
								$scope.loginFeedbackText = config.APPCONSTANTS_login_success_feedback_text;
							}
							else{
								$scope.loginFeedbackClass = config.APPCONSTANTS_login_notauth_feedback_class;
								$scope.loginFeedbackText = config.APPCONSTANTS_login_notauth_feedback_text + '\n' + response.data.message;
							}
						},
						function(response){
							// on error handler
							$scope.loginFeedbackClass = config.APPCONSTANTS_login_error_feedback_class;
							$scope.loginFeedbackText = config.APPCONSTANTS_login_error_feedback_text + '\n'+response.message;
						}
					)
				}
				else{
					$scope.loginFeedbackClass = config.APPCONSTANTS_login_nocredentials_feedback_class;
					$scope.loginFeedbackText = config.APPCONSTANTS_login_nocredentials_feedback_text;
				}
			}
			$scope.forgotPassword = function(){
				$http({
					method: 'POST',
					url: '',
					data: 'loginName=' + $scope.loginName
				}).then(
					function(response){//on success handler
					 console.log(response)
					 },
					function(response){//on error handler
					console.log(response)
					}
				);
			}
			$scope.register = function(){
				$http({
					method: 'POST',
					url: '',
					data: 'loginName=' + $scope.loginName + '&loginPassword=' + $scope.loginPassword
				}).then(
					function(response){
						//on success handler
						console.log(response)
					},
					function(response){
						//on error handler
						console.log(response);
					}
				);
			}
		}]
	}
}])*/