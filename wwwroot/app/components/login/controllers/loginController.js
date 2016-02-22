angular.module('ontdekjouwtalent')
.controller('loginController',
	['$scope','$http','AppConfig','I18nService',function($scope,$http,AppConfig,I18nService){
		$scope.loginSubmit = function(){
			var loginName = $scope.loginName || "";
			var password = $scope.loginPassword || "";
			$scope.loginFeedbackText = "";

			if(loginName.length && password.length){
				$http({
					//headers:{'Content-Type','application/json'},
					method: 'POST',
					url: AppConfig.APP_API_URL + '/authenticate',
					data: {username: $scope.loginName, password:$scope.loginPassword, deviceId:''}
				})
				.then(
					function(successResponse){
						$scope.error = successResponse.status != 200
						$scope.loginFeedbackText = $scope.error ? I18nService.getText(successResponse.data.message) : "";
					},
					function(errorResponse){
						$scope.error = errorResponse.status != 200 //error is nu boolean, kan in de toekomst uitgebreid worden
						$scope.loginFeedbackText = I18nService.getText(errorResponse.data.message);
					}
				)
			}
			else{
				$scope.loginFeedbackClass = AppConfig.APP_LOGIN_NOCREDENTIALS_FEEDBACK_CLASS;
				$scope.loginFeedbackText = AppConfig.APP_LOGIN_NOCREDENTIALS_FEEDBACK_TEXT;
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
	}
]);