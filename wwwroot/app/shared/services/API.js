angular.module('app.HRMatches')
.service('APIService',function($http,$q,$state,AppConfig){

	this.authenticate = function(data){
		return $http({
			method: 'POST',
			url: AppConfig.APP_API_URL + '/authenticate',
			data: data
		})
	}

	this.logout = function(tokens){
		return $http({
			method: 'POST',
			url: AppConfig.APP_API_URL + '/logout/',
			data: {
				'tokens':tokens
			}
		})
	}

	this.validateTokens = function(tokens){
		var promises = tokens.map(function(token,i,tokens){
			return $http({
				method: 'GET',
				url: AppConfig.APP_API_URL + '/validate_token/' + token
			});
		})
		
		return $q.all(promises);
	}

})
