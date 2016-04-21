angular.module('app.ontdekJouwTalent')
.controller('AuthController',
	['$scope','$state','AppConfig','AuthService','TranslationService','SessionService',
	 function($scope,$state,AppConfig,AuthService,TranslationService,SessionService){

		//AUTHENTICATE
		$scope.authenticate = function(user){
			var loggedInDomains = "";
			SessionService.set('username',user.username);
			SessionService.set('password',user.password);
			$scope.loginFeedbackText = "";
			$scope.profiles = [];

			if(user.username.length && user.password.length){
				AuthService.authenticate({
					username: user.username,
					password: user.password
				})
				.then(
					function(successResponse){
						// AUTHENTICATE SUCCESS
						$scope.error = successResponse.status != 200
						$scope.loginFeedbackText = $scope.error ? TranslationService.getText(successResponse.data.message) : "";
						$scope.profiles = successResponse.data.profiles;

						successResponse.data.profiles.forEach(function(currentProfile,index,profiles){
							if(currentProfile.loggedIn == true){
								// OTHER USER SESSION ACTIVE
								loggedInDomains += "\n" + currentProfile.domainName + " (" + currentProfile.domainOwner + ")";
							}
							if(loggedInDomains.length > 0){
								$scope.loggedInWithProfileText = TranslationService.getText('LOGIN_LOGGEDINWITHPROFILE') + loggedInDomains;
							}
						});
						if(successResponse.data.profiles.length > 1){
							// MULTIPLE PROFILES
							$scope.userHasMultipleProfiles = TranslationService.getText('LOGIN_MULTIPLEPROFILES');

								$scope.profiles = successResponse.data.profiles;
								$state.go('login.userProfiles');
						}
						else{
							// LOG IN WITH PROFILE
							login(successResponse.data.profiles[0].domainId);
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
			return AuthService.resetPassword({
					password:newPassword,
					secretKey:SessionService.get('secretKey')
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
		 $scope.login = login
		 function login(selectedDomainId){

			if(!selectedDomainId){
				$state.go('login');
			}

			// LOG IN WITH SELECTED  PROFILE
			AuthService.login({
				deviceId: AppConfig.APPCONSTANTS_DEVICEID,
				domainId: selectedDomainId,
				username: SessionService.get('username'),
				password: SessionService.get('password')
			})
			.then(
				function(successResponse){
					// CREATE LOCAL SESSION
					SessionService.setCurrentUser(successResponse.data.token);
					$state.go(AppConfig.APPCONSTANTS_NAVIGATION_ENTRYPOINT);
				},
				function(errorResponse){
					console.log(errorResponse)
				}
			).finally(
				function(){
					SessionService.delete('username');
					SessionService.delete('password');
					ApiService.trackdata('login');
				}
			);
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