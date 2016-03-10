angular.module('app.HRMatches')
.service('AuthService',function($state,APIService,SessionService){

	this.authenticate = function(data){
		return APIService.authenticate(data);
	}
	
	this.logout = function(tokens){
		if(!tokens){
			var currentUser = SessionService.getCurrentUser();
			var tokens = [currentUser.token];
		}
		SessionService.removeCurrentUser();
		return APIService.logout(tokens);
	}

	this.validateTokens = function(tokens){
		var result = {profiles:[],selectedToken:undefined};

		return APIService.validateTokens(tokens)		
		.then(
			function(successResponse){
				//ALL $http calls are resolved
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
})
