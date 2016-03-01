/*
 * LOGIN MODULE
 * date:		february 2016
 * 
 * view:	/app/components/login/views/login.html, contains directive hrmLoginAdvertoriial
 * 
 * basic use case:
 * 	authentication via loginSubmit(). Response triggers /app/components/login/views/selectProfile.html only if user is logged in and/or has multiple profiles
 * 
 * */

angular.module('app.HRMatches')
.controller('LoginController',
	['$scope','$http','AppConfig','I18nService','$location','SessionService','$state',
	 function($scope,$http,AppConfig,I18nService,$location,SessionService,$state){

		//AUTHENTICATE
		$scope.loginSubmit = function(){
			var loginName = $scope.loginName || "";
			var password = $scope.loginPassword || "";
			$scope.loginFeedbackText = "";
			$scope.profiles = [];
			
			if(loginName.length && password.length){
				$http({
					method: 'POST',
					url: AppConfig.APP_API_URL + '/authenticate',
					data: {
						username: $scope.loginName,
						password:$scope.loginPassword,
						candidateOrigin: $location.host(),
						deviceId:''
					}
				})
				
				// AUTHENTICATE SUCCESS
				.then(
					function(successResponse){
						$scope.error = successResponse.status != 200
						$scope.loginFeedbackText = $scope.error ? I18nService.getText(successResponse.data.message) : ""; //geen text vertonen bij status 200 - toon e-profile pagina
						$scope.tokens = successResponse.data.tokens; //authenticated accounts are identified by these tokens

/* ==START== MOCKDATA ALREADYLOGGEDIN */
  successResponse.data.status = {
	loggedInWithProfile: 'FDVFVF86-7BFD-7VBF-DVFD79TY'	  
  }
/* ==END== MOCKDATA ALREADYLOGGEDIN */
						
						if(successResponse.data.status && successResponse.data.status.loggedInWithProfile){

							// OTHER USER SESSION ACTIVE
							$scope.loggedInWithProfileText = I18nService.getText('LOGIN_LOGGEDINWITHPROFILE');

							if(successResponse.data.token.length > 1){

								// MULTIPLE PROFILES KNOWN
								$scope.userHasMultipleProfiles = I18nService.getText('LOGIN_MULTIPLEPROFILES');
								validateTokens(successResponse.data.token);
							}

							// SHOW MODAL 'MULTIPLE PROFILES' / 'ALREADY LOGGED IN' 
							$state.go('login-multipleProfiles');
							//$('#profilesModal').modal('show');

						}
  
						else if(successResponse.data.token.length > 1){

							// MULTIPLE PROFILES KNOWN
							$scope.userHasMultipleProfiles = I18nService.getText('LOGIN_MULTIPLEPROFILES');
							validateTokens(successResponse.data.token);
							$('#profilesModal').modal('show');
						}

						else{
							// NO OTHER SESSIOIN, SINGLE PRPOFILE
							SessionService.setCurrentUser(successResponse.data);
							$state.go(AppConfig.APP_NAVIGATION_ENTRYPOINT);
						}
					},
					// AUTHENTICATE ERROR
					function(errorResponse){
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
		
		// RETRIEVE MULTIPLE PROFILES
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
		

		$scope.finishAuthentication = function(selectedProfile){
			if(selectedProfile){
				SessionService.setCurrentUser(selectedProfile);
			}
			$state.go(AppConfig.APP_NAVIGATION_ENTRYPOINT);
			$('#profilesModal').modal('hide');
			$('body').removeClass('modal-open');
			$('.modal-backdrop').remove();
		}
		
	}
]);