angular.module('app.HRMatches')
.service('AuthService',function($state,APIService,SessionService){

	this.authenticate = function(data){
		return APIService.authenticate(data);
	}

	this.logout = function(tokens){
		if(!tokens){
			//LOGOUT CURRENT USER
			var currentUser = SessionService.getCurrentUser();
			var tokens = [currentUser.token];
			SessionService.removeCurrentUser();
		}
		return APIService.logout(tokens);
	}

	this.validateTokens = function(tokens){
		var result = {profiles:[],selectedToken:undefined};

		return APIService.validateTokens(tokens)		
		.then(
			function(successResponse){
				angular.forEach(successResponse,function(successRespons,i,successResponse){
					this.profiles.push(successRespons.data);
				},result);
				return result;
			}
		)
		.then(
			function(result){
				angular.forEach(result.profiles,function(profile,i,profiles){
					if(profile.loggedIn){
						result.selectedToken = profile.token;
					}
				});
				return result;
			},
			function(errorResponse){
				console.log('validateTokens error: ',validateTokens);
			}
		);
	}

	// chaining promises http://solutionoptimist.com/2013/12/27/javascript-promise-chains-2/
	//data = {hostName:...,emailAddress:...}
	this.forgotPassword = function(data){
		return APIService.forgotPassword(data)
		.then(function(data){
			return data;//{validate_ok:true/false,message:I18nKey}
		});
	}

	//data = {passwordResetToken:...}
	this.validateSecretKey = function(key){
		return APIService.validateSecretKey(encodeURIComponent(key))
		.then(
			function(successResponse){
				SessionService.set('secretKey',$stateParams.key);
				return {validate_ok:successResponse.tokenIsValid}
			}
			,function(errorResponse){
				SessionService.set('secretKey',$stateParams.key);
				return {
					validate_ok:false
					,message: (errorResponse.ERROR ? errorResponse.ERROR : '')
				}
			})
	}

	this.resetPassword = function(data){
		 //data = {password:...,passwordResetToken:...}
		return APIService.resetPassword(data)
		.then(function(data){
			return data; // {update_OK:...}}
		})
	}
	
	this.isLoggedIn = function(){
		return SessionService.isLoggedIn();
	}
	
	this.register = function(data){
		return APIService.register(data)
		.then(function(data){
			return data;
		})
	}
})
