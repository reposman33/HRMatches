angular.module('app.HRMatches')
.service('APIService',function($http,$timeout,$q,$state,$q,AppConfig){

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
	
	this.load = function(data){
		return $http({
			method:data.api_method
			,url: data.api_url
			,data:_loadParams(data.api_params)
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
	
	_loadParams = function(params){
		var result={};
		for(var i=0;i<params.length;i++){
			result[params[i].key] = params[i].value;
		}
		return result;
	}
})
