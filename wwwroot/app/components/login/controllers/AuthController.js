angular.module('app.HRMatches')
.controller('AuthController',
	['$scope','$http','$location','$modal','$rootScope','$state','AppConfig','AuthService','I18nService','SessionService',
	 function($scope,$http,$location,$modal,$rootScope,$state,AppConfig,AuthService,I18nService,SessionService){

		var userProfilesModal;

		//AUTHENTICATE
		$scope.authenticate = function(){
			var loginName = $scope.loginName || "";
			var password = $scope.loginPassword || "";

			$scope.loginFeedbackText = "";
			$scope.profiles = [];
			
			if(loginName.length && password.length){
				AuthService.authenticate({
					username: $scope.loginName,
					password:$scope.loginPassword,
					candidateOrigin: $location.host(),
					deviceId:''
				})
				.then(
					function(successResponse){
						// AUTHENTICATE SUCCESS
						$scope.error = successResponse.status != 200
						$scope.loginFeedbackText = $scope.error ? I18nService.getText(successResponse.data.message) : "";
						$scope.tokens = successResponse.data.tokens; //authenticated accounts are identified by these tokens

						if(successResponse.data.status && successResponse.data.status.loggedInWithProfile){

							// OTHER USER SESSION ACTIVE
							$scope.loggedInWithProfileText = I18nService.getText('LOGIN_LOGGEDINWITHPROFILE');

						}
						if(successResponse.data.token.length > 1){

							// MULTIPLE PROFILES
							$scope.userHasMultipleProfiles = I18nService.getText('LOGIN_MULTIPLEPROFILES');
							AuthService.validateTokens(successResponse.data.token)
							.then(function(result){
								$scope.profiles = result.profiles;
								$scope.selectedToken = result.selectedToken;
								$state.go('login.userProfiles');
							})
						}

					},
					function(errorResponse){
						// AUTHENTICATE ERROR
						$scope.error = errorResponse.status != 200 //error is nu boolean, kan in de toekomst uitgebreid worden
						$scope.loginFeedbackText = I18nService.getText(errorResponse.data.message);
					}
				)
			}
			else{
				// NO PASSWORD / USERNAME PROVIDED
				$scope.loginFeedbackText = I18nService.getText('LOGIN_NOCREDENTIALS');
			}
		}

		// FORGOT PASSWORD
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
		
		
		// REGISTER
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


		$scope.confirmLogin = function(selectedToken){
			var logoutTokens = [];

			if(!selectedToken){
				$state.go('login');
			}
			
			//STORE SELECTED PROFILE
			SessionService.setCurrentUser(selectedToken);

// remove this if working
$rootScope.selectedToken = selectedToken;

			var tokens = SessionService.get('tokens');
			angular.forEach(tokens,function(token){
				if(token!=selectedToken){
					logoutTokens.push(token);
				}
			});
			// log other tokens out
			if(logoutTokens.length){
				AuthService.logout(logoutTokens)
			}

			$state.go(AppConfig.APP_NAVIGATION_ENTRYPOINT);
		}


		$scope.logout = function (){
			AuthService.logout();
			$state.go('login');
		}
		
		$scope.closeUserProfilesModal = function(){
			userProfilesModal.close();
		}
	}
]);