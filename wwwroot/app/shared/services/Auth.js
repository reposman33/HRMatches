angular.module('app.HRMatches')
.service('AuthService',function($http,$q,$state,AppConfig,SessionService){
	
	var service = this;

	service.authenticate = function(data){
		var data = data ? data : SessionService.getCurrentUser();
		return $http({
			method: 'POST',
			url: AppConfig.APP_API_URL + '/authenticate',
			data: data
		});
	}
	
	service.logout = function(newState){
		var data = SessionService.getCurrentUser();
		$http({
			method: 'GET',
			url: AppConfig.APP_API_URL + '/logout/' + data
		})
		.then(
			function(successResponse){
				SessionService.removeCurrentUser();
				if(newState){
					$state.go(newState);
				}
			},
			function(errorResponse){
				console.log('error @ '+ AppConfig.APP_API_URL + '/logout:\n' + errorResponse);
			}
		);
	}
	
	service.validateTokens = function(tokens){
		var result = [];
		var deferred = $q.defer();
		
		// RETRIEVE MULTIPLE PROFILES
		return $q.all(tokens.map(function(token){
			return $http({
				method: 'GET',
				url: AppConfig.APP_API_URL + '/validate_token/' + token
			})
		}))
		.then( //result of ALL $http calls
			function(successResponse){
				successResponse.forEach(function(val,i){
					result.push(val.data);
				});
				return result;
			},
			function(errorResponse){
				console.log('error in /validate_token! ',errorResponse);
			}
		);
	}
})
