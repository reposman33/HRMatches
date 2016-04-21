/**
 * @ngdoc service
 * @name app.ontdekJouwTalent.service:APIService
 * @description
 * This service contains functionality for calls to the REST backend <br /><br />
 * Dependencies: $http,AppConfig,SessionService<br />
 * */
angular.module('app.ontdekJouwTalent')
.service('APIService',
	['$http','AppConfig','SessionService',
	function($http,AppConfig,SessionService){

	this.request = function(data){
		var token = data.addToken == true ? SessionService.getCurrentUserToken() : '';

		return $http({
			method:data.method
			,url: AppConfig.APPCONSTANTS_API_URL + '/' + data.endpoint + (token != '' ? ('/' + token) : '')
			,data:_concatParams(data.parameters)
		});
	}


	this.login = function(data){
		return this.request({
			method: AppConfig.API_ENDPOINTS.login.method,
			endpoint: AppConfig.API_ENDPOINTS.login.endpoint,
			addToken: AppConfig.API_ENDPOINTS.login.addToken,
			parameters: data
		});
	}


	this.authenticate= function(data){
		return this.request({
			method: AppConfig.API_ENDPOINTS.authenticate.method,
			endpoint: AppConfig.API_ENDPOINTS.authenticate.endpoint,
			addToken: AppConfig.API_ENDPOINTS.authenticate.addToken,
			parameters: data
		});
	}


	this.logout = function(data){
		return this.request({
			method: AppConfig.API_ENDPOINTS.logout.method,
			endpoint: AppConfig.API_ENDPOINTS.logout.endpoint,
			addToken: AppConfig.API_ENDPOINTS.logout.addToken,
			parameters: data
		});
	}

	this.validateSecretKey = function(secretKey){
		return $http({
			method: 'POST'
			,url: AppConfig.APPCONSTANTS_API_URL + '/validate_secretkey'
			,data:{
				secretkey: secretKey
			}
		});
	}


	this.resetPassword = function(data){
		return $http({
			method: 'POST',
			url: AppConfig.APPCONSTANTS_API_URL + '/resetpassword',
			data: {
				secretKey: data.secretKey
				,password: data.password
			}
		});
	}
	
	this.register = function(data){
		return $http({
				method: 'POST',
			url: '',
			data: ''//'loginName=' + $scope.loginName + '&loginPassword=' + $scope.loginPassword
		});
	}
	

	// UPDATETRANSLATIONKEY
 	/**
	 * @ngdoc method
	 * @name edit
	 * @methodOf app.ontdekJouwTalent.service:APIService
	 * @description
	 * Submits an updated translation key.<br/><br/>
	 * Dependencies:  TranslationService.
	 *
	 * @param {Object} data - The new data to save {key: translationKey,value: translationValue}
	 */
	this.updateTranslationKey = function(data){
		return $http({
			method: 'POST'
			,url: AppConfig.APPCONSTANTS_API_URL + '/updateTranslation'
			,data:{
				displayName:data.displayName
				,id: data.id
			}
		});
	}

		/*
		* @toStateName: name of state where to transition to
		* @currentState: name of state where onEnter is currently executed
		* @description: onEnter() of child states (eg 'parent.child') is called twice: once for state parent ('parent')
		* and once for 'parent.child' even if only defined in the child's onEnter() callBack
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
		.then(
			function(succesResponse){
				console.log('clientvariables logged for state \'',toStateName,'\'');
			}
		)
		.catch(
			function(errorResponse){
				console.log('clientvariables NOT logged for state \'',toStateName,'\'');
			}
		);
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
		);
	}

	_concatParams = function(params){
		var result={};
		for(var i=0;i<params.length;i++){
			result[params[i].name] = params[i].value;
		}
		return result;
	}
}]);
