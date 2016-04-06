angular.module('app.HRMatches')
.service('APIService',['$http','$timeout','$q','$state','AppConfig','SessionService',
	function($http,$timeout,$q,$state,AppConfig,SessionService){

	this.authenticate = function(data){
		return $http({
			method: 'POST',
			url: AppConfig.APPCONSTANTS_API_URL + '/authenticate',
			data: data
		})
	}

	this.logout = function(tokens){
		return $http({
			method: 'POST',
			url: AppConfig.APPCONSTANTS_API_URL + '/logout/',
			data: {
				'tokens':tokens
			}
		})
	}

	this.validateTokens = function(tokens){
		var promises = tokens.map(function(token,i,tokens){
			return $http({
				method: 'GET',
				url: AppConfig.APPCONSTANTS_API_URL + '/validate_token/' + token
			});
		})

		return $q.all(promises);
	}

	// FORGOTPASSWORD
	this.forgotPassword = function(data){
		return $http({
			method: 'POST',
			url: AppConfig.APPCONSTANTS_API_URL + '/forgotpassword',
			data: {
				hostname: data.hostName,
				emailaddress: data.emailAddress
			}
		})
	}

	this.validateSecretKey = function(secretKey){
		return $http({
			method: 'POST'
			,url: AppConfig.APPCONSTANTS_API_URL + '/validate_secretkey'
			,data:{
				secretkey: secretKey
			}
		})
	}


	this.resetPassword = function(data){
		return $http({
			method: 'POST',
			url: AppConfig.APPCONSTANTS_API_URL + '/resetpassword',
			data: {
				secretKey: data.secretKey
				,password: data.password
			}
		})
	}
	
	this.register = function(data){
		return $http({
				method: 'POST',
			url: '',
			data: ''//'loginName=' + $scope.loginName + '&loginPassword=' + $scope.loginPassword
		})
	}
	
	this.request = function(data){
		var token = SessionService.getCurrentUserToken();
		return $http({
			method:data.method
			,url: AppConfig.APPCONSTANTS_API_URL + '/' + data.endpoint + (token != '' ? ('/' + token) : '')
			,data:_loadParams(data.parameters)
		})
	}
			
	this.updateTranslationKey = function(data){
		return $http({
			method: 'POST'
			,url: AppConfig.APPCONSTANTS_API_URL + '/updateTranslation'
			,data:{
				displayName:data.displayName
				,id: data.id
			}
		})
	}

	this.trackData = function(currentState){
		// assign values to clientvariables
		var params = {
			token:SessionService.getCurrentUserToken()
			,state: currentState
		}
		for(var param in params){
			if(params.hasOwnProperty[param]){
				AppConfig.API_ENDPOINTS.trackdata.parameters[0].value[param] = params.param;
			}
		}
		this.request(AppConfig.API_ENDPOINTS.trackdata)
		.then('clientvariab;les logged via ', AppConfig.API_ENDPOINTS.trackdata.endpoint);
	}


	_loadParams = function(params){
		var result={};
		for(var i=0;i<params.length;i++){
			result[params[i].name] = params[i].value;
		}
		return result;
	}
}])
