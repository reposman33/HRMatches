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
	['$scope','$rootScope','$state','AppConfig','AuthService','filterFilter','TranslationService','SessionService','APIService',
	 function($scope,$rootScope,$state,AppConfig,AuthService,filterFilter,TranslationService,SessionService,APIService){

		 $scope.login = login;

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
				APIService.call(AppConfig.API_ENDPOINTS.authenticate,{username: user.username,password: user.password})

				.then(

					// SUCCESS (STATUS:200)

					function(successResponse){
						// AUTHENTICATE SUCCESS
						$scope.profiles = successResponse.profiles;

						successResponse.profiles.forEach(function(currentProfile,index,profiles){
							if(currentProfile.loggedIn == true){
								// OTHER USER SESSION ACTIVE
								loggedInDomains += "\n" + currentProfile.domainName + " (" + currentProfile.domainOwner + ")";
							}
							if(loggedInDomains.length > 0){
								$scope.loggedInWithProfileText = TranslationService.getText('LOGIN_LOGGEDINWITHPROFILE') + loggedInDomains;
							}
						});
						if(successResponse.profiles.length > 1){
							// MULTIPLE PROFILES
							$scope.userHasMultipleProfiles = TranslationService.getText('LOGIN_MULTIPLEPROFILES');
							$scope.profiles = successResponse.profiles;
							$state.go('login.userProfiles');
						}
						else{
							// LOG IN WITH ONLY PROFILE AVAILABLE
							login(successResponse.profiles[0].domainId);
						}
					}

					// ERROR (status:501)

					,function(errorResponse){
						$scope.loginFeedbackText = TranslationService.getText('LOGIN_ERROR');
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
			APIService.call(AppConfig.API_ENDPOINTS.forgotPassword,{'emailaddress':emailAddress,hostname:AppConfig.APPCONSTANTS_HOSTNAME})
			.then(
				function(successResponse){
					$scope.message = successResponse.message;
					//BACKEND SENDS EMAIL WITH LINK: /resetPassword/:key'
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
			return APIService.call(AppConfig.API_ENDPOINTS.resetPassword,{
					password:newPassword,
					secretKey:SessionService.get('secretKey')
				}
			)
			.then(
				function(successResponse){
					$state.go('message',{message:successResponse.message});
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
		function login(selectedDomainId){
			if(!selectedDomainId){
				$state.go('login');
			}

			// LOG IN WITH SELECTED  PROFILE
			APIService.call(AppConfig.API_ENDPOINTS.login,{
				deviceId: AppConfig.APPCONSTANTS_DEVICEID,
				domainId: selectedDomainId,
				username: SessionService.get('username'),
				password: SessionService.get('password')
			})
			.then(
				function(successResponse){
					// RETRIEVE USERPROFILE DATA
					var selectedUserProfile = filterFilter($scope.profiles,{domainId:selectedDomainId});
					SessionService.setCurrentUser({
						userProfile:selectedUserProfile[0],
						token:successResponse.token,
						username:SessionService.get('username')
					});
					$state.go(AppConfig.APPCONSTANTS_NAVIGATION_ENTRYPOINT);
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