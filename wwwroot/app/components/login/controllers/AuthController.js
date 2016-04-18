angular.module('app.HRMatches')
.controller('AuthController',
	['$scope','$location','$rootScope','$state','AppConfig','AuthService','TranslationService','SessionService',
	 function($scope,$location,$rootScope,$state,AppConfig,AuthService,TranslationService,SessionService){

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
						$scope.loginFeedbackText = $scope.error ? TranslationService.getText(successResponse.data.message) : "";
						$scope.tokens = successResponse.data.tokens; //authenticated accounts are identified by these tokens

						if(successResponse.data.status && successResponse.data.status.loggedInWithProfile){
							// OTHER USER SESSION ACTIVE
							$scope.loggedInWithProfileText = TranslationService.getText('LOGIN_LOGGEDINWITHPROFILE');

						}
						if(successResponse.data.token.length > 1){
							// MULTIPLE PROFILES
							$scope.userHasMultipleProfiles = TranslationService.getText('LOGIN_MULTIPLEPROFILES');
							AuthService.validateTokens(successResponse.data.token)
							.then(function(result){
								$scope.profiles = result.profiles;
								$scope.selectedToken = result.selectedToken;
								//STORE TOKENS FROM USERPROFILES
								var tokens = result.profiles.map(function(currentProfile, ind, profiles){return currentProfile.token;})
								SessionService.set('tokens',tokens);
								$state.go('login.userProfiles');
							})
						}
						else{ // SINGLE PROFILE - USER IS LOGGED IN
							// CREATE LOCAL SESSION
							SessionService.setCurrentUser(data.token);

						}

					},
					function(errorResponse){
						// AUTHENTICATE ERROR
						$scope.error = errorResponse.status != 200 //error is nu boolean, kan in de toekomst uitgebreid worden
						$scope.loginFeedbackText = TranslationService.getText(errorResponse.data.message);
					}
				)
			}
			else{
				// NO PASSWORD / USERNAME PROVIDED
				$scope.loginFeedbackText = TranslationService.getText('LOGIN_ERROR');
			}
		}


		// FORGOT PASSWORD
		$scope.forgotPassword = function(emailAddress){
			AuthService.forgotPassword({
				hostName:AppConfig.APPCONSTANTS_HOSTNAME,
				emailAddress:emailAddress
			})
			.then(
				function(successResponse){
					$scope.message = successResponse.data.message;
					//BACKEND SENDS EMAIL WITH LINK: /resetPassword/:key'
				}
				,function(errorResponse){
					$scope.message = errorResponse.data.message;
					$state.go('message',{message:errorResponse.data.message});
				}
			);
		}


		$scope.resetPassword = function(newPassword){
			return AuthService.resetPassword(
				{
					password:newPassword
					,secretKey:SessionService.get('secretKey')
				}
			)
			.then(
				function(successResponse){
					$state.go('message',{message:successResponse.data.message});
				}
				,function(errorResponse){
					$state.go('message',{message:errorResponse.data.message});
				}
			);
		}

		// LOGIN NA PROFIEL SELECTIE
		$scope.confirmLogin = function(selectedToken){
			var logoutTokens = [];

			if(!selectedToken){
				$state.go('login');
			}

			// LOGOUT EACH NOT-SELECTED USERPROFILE
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

			// CREATE LOCAL SESSION
			SessionService.setCurrentUser(selectedToken);
			$state.go(AppConfig.APPCONSTANTS_NAVIGATION_ENTRYPOINT);
		}


		$scope.logout = function (){
			AuthService.logout()
			$state.go('logout',{reload:true});
		}

		// 2STEP AUTHENTICATION
		$scope.twoStepAuthenticationSubmit = function(code){

		}
}

]);