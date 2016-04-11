angular.module('app.HRMatches')
.service('APIService',['$http','$timeout','$q','$state','AppConfig','SessionService',
	function($http,$timeout,$q,$state,AppConfig,SessionService){

	this.request = function(data){
		var token = data.addToken ? SessionService.getCurrentUserToken() : '';

		return $http({
			method:data.method
			,url: AppConfig.APPCONSTANTS_API_URL + '/' + data.endpoint + (token != '' ? ('/' + token) : '')
			,data:_loadParams(data.parameters)
		})
	}


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
			url: AppConfig.APPCONSTANTS_API_URL + '/logout',
			data: {
				'tokens':tokens
			}
		})
	}

	this.validateTokens = function(tokens){
		var promises = tokens.map(function(token){
			return $http({
				method: 'GET',
				url: AppConfig.APPCONSTANTS_API_URL + '/validate_token/' + token
			});
		});

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

		/*
		* @toStateName: name of state where to transition to
		* @currentState: name of state where onEnter is currently executed
		* @description: onEnter() of child states (eg 'parent.child') ia called twice: once for state parent ('parent')
		* ]and once for 'parent.child' even if only defined in the child's onEnter() callBack
		* */
	this.trackData = function(toStateName){
		// assign values to clientvariables
		var params = {
			token:SessionService.getCurrentUserToken()
			,state: toStateName
		}
		for(var param in params){
			if(params.hasOwnProperty(param)){
				AppConfig.API_ENDPOINTS.trackdata.parameters[0].value[param] = params[param];
			}
		}
		this.request(AppConfig.API_ENDPOINTS.trackdata)
		.then(console.log('clientvariables logged for state \'',toStateName,'\' : ', AppConfig.API_ENDPOINTS.trackdata.parameters[0]));
	}
	
	this.requestLocalJSON = function(data){
		return $http({
			method: 'GET'
			,url: AppConfig.APPCONSTANTS_PROTOCOL + '//' + AppConfig.APPCONSTANTS_HOSTNAME + data.url
		})
		.then(
			function(successResponse){
				return successResponse.data;
			}
		)
	}

	_loadParams = function(params){
		var result={};
		for(var i=0;i<params.length;i++){
			result[params[i].name] = params[i].value;
		}
		return result;
	}
}]);
