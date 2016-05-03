/**
 * @ngdoc service
 * @name app.ontdekJouwTalent.service:APIService
 * @description
 * This service contains functionality for calls to the REST backend <br /><br />
 * Dependencies: $http,AppConfig,SessionService<br />
 * */
angular.module('app.ontdekJouwTalent')
.service('APIService',['$http','$rootScope','$state','AppConfig','SessionService',
	function($http,$rootScope,$state,AppConfig,SessionService){

	// REQUEST
	/**
	 * @ngdoc method
	 * @name request
	 * @methodOf app.ontdekJouwTalent.service:APIService
	 * @description Performs a $http request, accepts API_ENDPOINT and data
	 * @param {Object} data - API_ENDPOINT data and payload for Api call
	 */
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
			url += (token === '') ? '' : (qpDelimiter + 'token=' + token);
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
		.then(
			// API CALL SUCCESSFUL (200 OK)
			function(successResponse){
				return successResponse.data;
			}
			// API CALL RETURNS NON-200 ERROR
			,function(errorResponse){
				$rootScope.error = {status:errorResponse.status,statusText:errorResponse.statusText};
				var message = {message:'Er is een fout opgetreden: ' + errorResponse.status +' (' + errorResponse.statusText + ')'};
				switch(errorResponse.status){
					case 500:{ // server error
						$state.go('message',message);
						return errorResponse;
						break;
					}
					case 501:{ // login error
						$state.go('message',message);
						return errorResponse;
						break;
					}
					case 401:{ //niet authenticated
						SessionService.removeCurrentUser(); //LOGOUT
						$state.go(AppConfig.APPCONSTANTS_NAVIGATION_REDIRECT.NOTAUTHENTICATED);
						return errorResponse;
						break;
					}
					case 403:{ // niet geauthoriseerd
						$state.go('message',message);
						return errorResponse;
						break;
					}
					default: {
						$state.go('message',{message:'Er is een onbekende fout opgetreden'});
						return errorResponse;
						break;
					}
				}
			}
		)
		.catch(
			function(errorResponse){
				console.log('clientvariables NOT logged for state \'',toStateName,'\'');
			}
		);

	}


	// ========== LOGIN ==========
	this.login = function(data){
		return this.request({API:AppConfig.API_ENDPOINTS.login, data:data});
	}

	this.authenticate= function(data){
		return $http({
			method:AppConfig.API_ENDPOINTS.authenticate.method
			,url: AppConfig.APPCONSTANTS_API_URL + '/' + AppConfig.API_ENDPOINTS.authenticate.endpoint
			,data: data
		});
		// DON'T USE THIS.REQUEST BECAUSE ERRORHANDLING IS DONE BY THE TEAMSCONTROLLER.
		//return this.request({API:AppConfig.API_ENDPOINTS.authenticate, data:data});
	}

	this.logout = function(data){
		return this.request({API:AppConfig.API_ENDPOINTS.logout, data:data});
	}

	this.forgotPassword = function(data){
		return this.request({API: AppConfig.API_ENDPOINTS.forgotPassword, data:data});
	}

	this.validateSecretKey = function(secretKey){
		return this.request({API: AppConfig.API_ENDPOINTS.validateSecretKey, data:{secretkey: secretKey}});
	}

	this.resetPassword = function(data){
		return this.request({API:AppConfig.API_ENDPOINTS.resetPassword,data:data});
	}

	this.register = function(data){
		return this.request({API:AppConfig.API_ENDPOINTS.registration});
	}


	// ========== SETTINGS-USERMANAGEMENT-RIGHTSANDROLES ==========
	this.permissions = function(){
		return this.request({API:AppConfig.API_ENDPOINTS.settings.userManagement.permissions});
	}

	this.role = function(id){
		if(id!=undefined) {
			return this.request({API: AppConfig.API_ENDPOINTS.settings.userManagement.roles, data: id});
		}
		else{
			return this.request({API: AppConfig.API_ENDPOINTS.settings.userManagement.roles});
		}
	}

	this.updateRolesAndPermissions = function(data){
		return this.request({API: AppConfig.API_ENDPOINTS.settings.userManagement.updateRolesAndPermissions,data:{roles:data}});
	}

	this.addRole = function(data){
		return this.request({API: AppConfig.API_ENDPOINTS.settings.userManagement.addRole, data:{roles:data}});
	}

	this.deleteRole = function(data){
		return this.request({API: AppConfig.API_ENDPOINTS.settings.userManagement.deleteRole, data:data});
	}


	// ========== SETTINGS-USERMANAGEMENT-TEAMS ==========
	this.team = function(id) {
		if(id!=undefined){
			return this.request({API: AppConfig.API_ENDPOINTS.settings.userManagement.teams,data:{teamid:id}});
		}
		else{
			return this.request({API: AppConfig.API_ENDPOINTS.settings.userManagement.teams});
		}
	}

	this.addTeam = function(data){
		this.trackData('addTeam');
		return this.request({API: AppConfig.API_ENDPOINTS.settings.userManagement.addTeam, data:data});
	}

	this.deleteTeam = function(data){
		this.trackData('deleteTeam');
		return this.request({API: AppConfig.API_ENDPOINTS.settings.userManagement.deleteTeam, data:data});
	}

	this.saveTeam = function(data){
		return this.request({API: AppConfig.API_ENDPOINTS.settings.userManagement.addTeam, data:data});
	}

	// ========== SETTINGS-USERMANAGEMENT-USERS ==========
	this.user = function(domainName) {
		if(domainName!=undefined){
			return this.request({API: AppConfig.API_ENDPOINTS.settings.userManagement.users,data:{domainName:domainName}});
		}
		else{
			return this.request({API: AppConfig.API_ENDPOINTS.settings.userManagement.users});
		}
	}

	this.deleteUser = function(data){
		return this.request({API: AppConfig.API_ENDPOINTS.settings.userManagement.deleteUser,data:data});
	}

	this.addUser = function(data){
		return this.request({API: AppConfig.API_ENDPOINTS.settings.userManagement.addUser,data:data});
	}

	 // ========== TRANSLATION ==========
	this.loadTranslation = function(){
		return this.request({API:AppConfig.API_ENDPOINTS.translation});
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
	//TODO implement method updateTranslation()
	this.updateTranslation = function(data){
		return this.request({API:AppConfig.API_ENDPOINTS.updateTranslation});
	}

	// ========== JOBLIST ==========
	this.loadJobList = function() {
		return this.request({API: AppConfig.API_ENDPOINTS.joblist});
	}


	// ====================
	/*
	* @toStateName: name of state where to transition to
	* @currentState: name of state where onEnter is currently executed
	* @description: onEnter() of child states (eg 'parent.child') is called twice: once for state parent ('parent')
	* and once for 'parent.child' even if only defined in the child's onEnter() callBack
	* */
	this.trackData = function(toStateName){
		// ASSIGN DYNAMIC VALUES TO THE CLIENTVARIABLES
		var trackingData = {
			token: SessionService.getCurrentUserToken()
			,state: toStateName
			,protocol: location.protocol
			,hostname: location.hostname //hostname van website
			,href: location.href // url (=incl protocol,port,hostname,querystring)
			,appVersion: navigator.appVersion //browser versie
			,language: navigator.language //browser taal
			,platform: navigator.platform //voor welk plaform is de browser
			,userAgent: navigator.userAgent //user agent
			,screenSize: screen.width + '*' + screen.height //breedte*hoogte van scherm
			,colorDepth: screen.colorDepth + '' //kleuren in bits/pixels
		};

		if($rootScope.error) {
			if ($rootScope.error.status != undefined) {
				trackingData.errorStatus = $rootScope.error.status;
			}
			if ($rootScope.error && $rootScope.error.statusText != undefined) {
				trackingData.errorStatusText = $rootScope.error.statusText;
			}
			delete $rootScope['error'];
		}
		return this.request({
			API: AppConfig.API_ENDPOINTS.trackdata,
			data: {trackingData:trackingData}
		})
		.then(
			function(succesResponse){
				if(trackingData.errorStatus != undefined){
					delete trackingData.errorStatus;
				}
				if(trackingData.errorStatusText != undefined){
					delete trackingData.errorStatusText;
				}
				console.log('clientvariables logged for state \'',toStateName,'\'');
				return succesResponse.data || {};
			}
		)
	}
	
	// TO BE REMOVED WHEN SETTINGS-USERMANAGEMENT COMES FROM API
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
}]);
