/**
 * @ngdoc controller
 * @name app.ontdekJouwTalent.controller:AuthenticationController
 * @description
 * This controller contains functionality for authenticating, login, resetPassword etc.
 * @requires $scope,$state,AppConfig,AuthService,TranslationService,SessionService
 * Referring states: login, login.*, logout
 * */
angular.module('app.ontdekJouwTalent')
.controller('AuthenticationController',
	['$scope','$state','AppConfig','AuthService','TranslationService','SessionService',
	 function($scope,$state,AppConfig,AuthService,TranslationService,SessionService){

		//AUTHENTICATE
		/**
		 * @ngdoc method
		 * @name authenticate
		 * @methodOf app.ontdekJouwTalent.controller:AuthenticationController
		 * @description
		 * Authenticates using provided username and password.<br/><br/>
		 * Dependencies: $state,SessionService,AuthService,TranslationService
		 *
		 * @param {Object} user: object with keys username,password
		 */
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


		// FORGOTPASSWORD
		/**
		 * @ngdoc		method
		 * @name		forgotPassword
		 * @methodOf	app.ontdekJouwTalent.controller:AuthenticationController
		 * @description	Initialises forgot password procedure using provided email address.<br/><br/>
		 * Dependencies: $state,AuthService
		 *
		 * @param {String} emailAddress: emailaddress to send email to with resetPassowrd link
		 */
		$scope.forgotPassword = function(emailAddress){
			AuthService.forgotPassword({'emailaddress':emailAddress})
			.then(
				function(successResponse){
					$scope.message = successResponse.data.message;
					//BACKEND SENDS EMAIL WITH LINK: /resetPassword/:key'
				}
				,function(errorResponse){
					$scope.message = (errorResponse.data && errorResponse.data.message != '') ? errorResponse.data.message : '';
					$state.go('message',{message:$scope.message});
				}
			);
		}


		// RESETPASSWORD
		/**
		 * @ngdoc method
		 * @name resetPassword
		 * @methodOf app.ontdekJouwTalent.controller:AuthenticationController
		 * @description
		 * Called when confirming the new password in resetPassword.html.<br/><br/>
		 * Dependencies: $state
		 *
		 * @param {String} newPassword: the new password in plaintext
		 */
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

		
		// LOGIN
		/**
		 * @ngdoc method
		 * @name login
		 * @methodOf app.ontdekJouwTalent.controller:AuthenticationController
		 * @description
		 * Logs user in after authentication<br/><br/>
		 * Dependencies: $state,AuthService,SessionService,ApiService
		 *
		 * @param {String} selectedDomainId: The id of the domain user log in to
		 */

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
					$state.go('^');
				}
			);
		}


		// LOGOUT
		/**
		 * @ngdoc method
		 * @name logout
		 * @methodOf app.ontdekJouwTalent.controller:AuthenticationController
		 * @description
		 * Logs user out<br/><br/>
		 * Dependencies: $state,AuthService
		 *
		 */
		$scope.logout = function (){
			AuthService.logout()
			$state.go('logout',{reload:true});
		}


		// AUTHENTICATEIN2STEPS
		/**
		 * @ngdoc method
		 * @name authenticateIn2Steps
		 * @methodOf app.ontdekJouwTalent.controller:AuthenticationController
		 * @description
		 * [ NOT IMPLEMENTED YET ]
		 * Authenticate using 2 step authentication
		 *
		 */
		$scope.authenticateIn2Steps = function(code){
		}
	 }
]);