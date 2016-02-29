angular.module('app.HRMatches')
.controller('LoginController',
	['$scope','$http','AppConfig','I18nService','$location','SessionService','$state',
	 function($scope,$http,AppConfig,I18nService,$location,SessionService,$state){

		$scope.loginSubmit = function(){
			var loginName = $scope.loginName || "";
			var password = $scope.loginPassword || "";
			$scope.loginFeedbackText = "";
			$scope.profiles = [];
			
			if(loginName.length && password.length){
				$http({
					//headers:{'Content-Type','application/json'},
					method: 'POST',
					url: AppConfig.APP_API_URL + '/authenticate',
					data: {
						username: $scope.loginName,
						password:$scope.loginPassword,
						candidateOrigin: $location.host(),
						deviceId:''
					}
				})
				.then(
					function(successResponse){
						$scope.error = successResponse.status != 200
						$scope.loginFeedbackText = $scope.error ? I18nService.getText(successResponse.data.message) : ""; //geen text vertonen bij status 200 - toon e-profile pagina
						
						if(successResponse.data.token.length == 1){
							// store user token for this session
							SessionService.setCurrentUser(successResponse.data.token[0]);
							$state.go('vacaturegids');
						}
						else if(successResponse.data.token.length > 1){
							// let user choose profile
							validateTokens(successResponse.data.token);
							// show window with profile info
							_profilesWindow('show');
						}
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
				url: AppConfig.APP_API_URL + '/resetpassword',
				data: {loginName: $scope.loginName}
			}).then(
				function(successResponse){
					console.log(successResponse)
				 },
				function(errorResponse){
					 console.log(errorResponse)
				}
			);
		}
		
		$scope.register = function(){
			$http({
				method: 'POST',
				url: '',
				data: 'loginName=' + $scope.loginName + '&loginPassword=' + $scope.loginPassword
			}).
			then(
				function(successResponse){
					console.log(successResponse)
				},
				function(errorResponse){
					console.log(errorResponse);
				}
			);
		}
		
		function validateTokens(tokens){
			result = [];
			for(token in tokens){
				$http({
					method: 'GET',
					url: AppConfig.APP_API_URL + '/validate_token/' + tokens[token]
				})
				.then(
					function(successResponse){
						$scope.profiles.push(successResponse.data);
					}
				)
			}
		}
		

		$scope.navigateTo = function(selectedProfile){
			SessionService.setCurrentUser(selectedProfile);
			$state.go('vacaturegids')
		}
		

		function _profilesWindow(status){
			switch (status){
				case 'init':
	
					break;
				case 'show':
					$('#profilesModal').modal();
					break;
	
				default:
	
					break;
			}
			
		}
	}
]);