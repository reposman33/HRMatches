/**
 * @ngdoc service
 * @name app.ontdekJouwTalent.service:APIService
 * @description
 * This service contains functionality for calls to the REST backend <br /><br />
 * Dependencies: $http,AppConfig,SessionService<br />
 * */
angular.module('app.ontdekJouwTalent')
.service('APIService',
	['$http','$state','AppConfig','SessionService',
	function($http,$state,AppConfig,SessionService){


	this.request = function(data){
		var token = data.API.addToken == true ? SessionService.getCurrentUserToken() : '';
		var url = (AppConfig.APPCONSTANTS_API_URL + ((data.API.endpoint != '') ? ('/' + data.API.endpoint) : ''));
		var payload = data.data || data.API.parameters;
		var qpDelimiter = '/?';

		if((data.API.method == 'GET' || data.API.method == 'DELETE')){
			// APPEND QUERY PARAMETERS TO URL FOR GET,DELETE HTTP METHODS
			angular.forEach(payload,function(value,key){
				url += (qpDelimiter + key + '=' + value);
				qpDelimiter = '&';
			});
			url += (token === '') ? url : qpDelimiter + 'token=' + token;
			payload = '';
		}
		else if((data.API.method == 'PUT' || data.API.method == 'POST')){
			//SEND DATA IN BODY
			if(token != ''){
				url += (qpDelimiter + 'token=' + token);
				payload.token = token;
			}
		}

		return $http({
			method:data.API.method
			,url: url
			,data: payload
		})
		.catch(
			function(errorResponse){
				if(errorResponse.status === 403){
					SessionService.removeCurrentUser();
					$state.go(AppConfig.APPCONSTANTS_NAVIGATION_REDIRECT.NOTAUTHENTICATED);
					event.preventDefault();
				}
			})
	}


	this.login = function(data){
		return this.request({API:AppConfig.API_ENDPOINTS.login, data:data});
	}


	this.authenticate= function(data){
		return this.request({API:AppConfig.API_ENDPOINTS.authenticate, data:data});
	}


	this.logout = function(data){
		return this.request({API:AppConfig.API_ENDPOINTS.logout, data:data});
	}

	this.permissions = function(){
		return this.request({API:AppConfig.API_ENDPOINTS.settings.userManagement.permissions});
	}


	this.roles = function(){
		return this.request({API:AppConfig.API_ENDPOINTS.settings.userManagement.roles});
	}

	this.loadTranslation = function(){
		return this.request({API:AppConfig.API_ENDPOINTS.translation});
	}

	this.loadJobList = function() {
		return this.request({API: AppConfig.API_ENDPOINTS.joblist});
	}

	this.forgotPassword = function(data){
		return this.request({API: AppConfig.API_ENDPOINTS.forgotPassword, data:data});
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
		return this.request({API:AppConfig.API_ENDPOINTS.registration});
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
		// ASSIGN DYNAMIC VALUES TO THE CLIENTVARIABLES
		AppConfig.API_ENDPOINTS.trackdata.parameters.token = SessionService.getCurrentUserToken();
		AppConfig.API_ENDPOINTS.trackdata.parameters.state = toStateName;

		this.request({
			API: AppConfig.API_ENDPOINTS.trackdata,
			data: AppConfig.API_ENDPOINTS.trackdata.parameters
		})
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


	this.updateRolesAndPermissions = function(data){
		return this.request({API: AppConfig.API_ENDPOINTS.settings.userManagement.updateRolesAndPermissions,data:{roles:data}});
	}


	this.getNewRoleId = function(data){
		return this.request({API: AppConfig.API_ENDPOINTS.settings.userManagement.getNewRoleId, data:{roles:data}});
	}


	this.deleteRole = function(data){
		return this.request({API: AppConfig.API_ENDPOINTS.settings.userManagement.deleteRole, data:data});
	}


	_concatParams = function(params){
		var result={};
		for(var i=0;i<params.length;i++){
			result[params[i].name] = params[i].value;
		}
		return result;
	}
}]);
