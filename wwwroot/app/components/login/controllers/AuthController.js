/*
 * LOGIN MODULE
 * date:		february 2016
 * 
 * view:	/app/components/login/views/login.html
 * 
 * basic use case:
 * 	authentication via loginSubmit(). Response triggers /app/components/login/views/selectProfile.html only if user is logged in and/or has multiple profiles
 * 
 * */

angular.module('app.HRMatches')
.controller('AuthController',
	['$scope','$http','$location','$modal','$state','AppConfig','AuthService','I18nService','SessionService','$stateParams',
	 function($scope,$http,$location,$modal,$state,AppConfig,AuthService,I18nService,SessionService,$stateParams){

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
						$scope.loginFeedbackText = $scope.error ? I18nService.getText(successResponse.data.message) : ""; //geen text vertonen bij status 200 - toon e-profile pagina
						$scope.tokens = successResponse.data.tokens; //authenticated accounts are identified by these tokens

// SIMULATE OTHER USER SESSION ACTIVE
successResponse.data.status = {}
successResponse.data.status.loggedInWithProfile = true;

						if(successResponse.data.status && successResponse.data.status.loggedInWithProfile){

							// OTHER USER SESSION ACTIVE
							$scope.loggedInWithProfileText = I18nService.getText('LOGIN_LOGGEDINWITHPROFILE');
						}
						if(successResponse.data.token.length > 1){
							// MULTIPLE PROFILES
							$scope.userHasMultipleProfiles = I18nService.getText('LOGIN_MULTIPLEPROFILES');
							AuthService.validateTokens(successResponse.data.token)
							.then(function(result){
								$state.go('login.userprofiles',{profiles: result});
							});
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
				$scope.loginFeedbackClass = AppConfig.APP_LOGIN_NOCREDENTIALS_FEEDBACK_CLASS;
				$scope.loginFeedbackText = AppConfig.APP_LOGIN_NOCREDENTIALS_FEEDBACK_TEXT;
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


		$scope.confirmLogin = function(selectedProfile){
			if(selectedProfile){
				SessionService.setCurrentUser(selectedProfile);
			}
			$state.go(AppConfig.APP_NAVIGATION_ENTRYPOINT);
		}


		$scope.logout = function (newState){
			AuthService.logout(newState);
		}
	}
]);