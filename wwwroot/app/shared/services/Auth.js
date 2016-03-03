angular.module('app.HRMatches')
.service('AuthService',function($http,AppConfig,SessionService){
	
	var service = this;

	service.authenticate = function(data){
		var data = data ? data : SessionService.getCurrentUser();
		return $http({
			method: 'POST',
			url: AppConfig.APP_API_URL + '/authenticate',
			data: data
		});
	}
	
	service.logout = function(data){
		var data = data ? data : SessionService.getCurrentUser();
		return $http({
			method: 'POST',
			url: AppConfig.APP_API_URL + '/logout',
			data: data.token
		});
	}

})