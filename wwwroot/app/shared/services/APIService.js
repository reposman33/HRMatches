/**
 * @ngdoc service
 * @name app.ontdekJouwTalent.service:APIService
 * @description
 * This service contains functionality for calls to the REST backend <br /><br />
 * Dependencies: $http,AppConfig,SessionService<br />
 * */
angular.module('app.ontdekJouwTalent')
.service('APIService',['$http','$q','$rootScope','$state','AppConfig','growl','SessionService',
	function($http,$q,$rootScope,$state,AppConfig,growl,SessionService) {
		// REQUEST
		/**
		 * @ngdoc method
		 * @name request
		 * @methodOf app.ontdekJouwTalent.service:APIService
		 * @parameters {Object} data {API:{endpoint:'',method:''},data:data}}
		 * @description Generic method, makes a http request.
		 */
		this.request = function(API,data){
			var token = SessionService.getCurrentUserToken();
			var url = (AppConfig.APPCONSTANTS_API_URL + (API.endpoint != '' ? ('/' + API.endpoint) : ''));
			var payload = data || API.parameters || [];
			var qpDelimiter = '/?';

			if((API.method == 'GET' || API.method == 'DELETE')){
				// url += token !== '' ? '/' + token) : ''; wellicht later als Taffy API gewijzigd is.
				// APPEND QUERY PARAMETERS TO URL
				angular.forEach(payload,function(value,key){
					if(!(value==undefined || value==null)){
//						url += '/' + key + '/' + value
						url += (qpDelimiter + key + '=' + value);
						qpDelimiter = '&';
					}
				});
				if(token!==''){
					// APPEND TOKEN
					url += (qpDelimiter + 'token=' + token);
					qpDelimiter = '&';
				}
				payload=''; // DON'T SEND DATA IN BODY FOR GET REQUEST
			}
			else if((API.method == 'PUT' || API.method == 'POST')){
				if(token != ''){
					url += (qpDelimiter + 'token=' + token);
				}
			}

			return $http({
				method:API.method
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
					return $q.reject(errorResponse);
				}
			)
		}


		this.call = function(API,data){
			return this.request(API,data)
			.then(
				function(successResponse){
					if(AppConfig.APPCONSTANTS_NONOTIFICATION.indexOf(API.endpoint) == -1){
						switch(API.method){
							case 'DELETE':
								growl.success('',{title:''});
								break;
							case 'POST':
								growl.success('',{title:''});
								break;
							case 'PUT':
								growl.success('',{title:''});
								break;
						}
					}
					return successResponse;
				},
				function(errorResponse){
					$rootScope.error = {status:errorResponse.status,statusText:errorResponse.statusText};
					var message = {message:'Er is een fout opgetreden: ' + errorResponse.status +' (' + errorResponse.statusText + ')'};

					switch(errorResponse.status){
						case 401: //niet authenticated
						case 403: // niet geauthoriseerd
							SessionService.removeCurrentUser(); //LOGOUT
							$state.go(AppConfig.APPCONSTANTS_NAVIGATION_REDIRECT.NOTAUTHENTICATED);
							break;

						case 404: // Not Found
						case 500: // server error
							growl.error(errorResponse,{title:''});
							return $q.reject(errorResponse);
							break;
						case 501: // login error - handled by AuthenticationController. Propagate rejected promise
							break;
						default:
							$state.go('message',{message:'Er is een onbekende fout opgetreden <br/><br/> errorResponse.status: ' + errorResponse.status + ',<br/> errorResponse.statusText: \'' + errorResponse.statusText + '\''});
							return $q.reject(errorResponse);
							break;
					}
				}
			)
		}

		// ========== LOGIN ==========

		this.forgotPassword = function(data){
			return this.request({API: AppConfig.API_ENDPOINTS.forgotPassword, data:data});
		}

		this.validateSecretKey = function(secretKey){
			return this.request({API: AppConfig.API_ENDPOINTS.validateSecretKey, data:{secretkey: secretKey}});
		}


		// ====================
		/*
		 * @toStateName: name of state where to transition to
		 * @currentState: name of state where onEnter is currently executed
		 * @description: onEnter() of child states (eg 'parent.child') is called twice: once for state parent ('parent')
		 * and once for 'parent.child' even if only defined in the child's onEnter() callBack
		 * */
		this.trackData = function(toStateName){
			if(AppConfig.APPCONSTANTS_ISLOCAL){
				return;
			}
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

			AppConfig.API_ENDPOINTS.trackdata.parameters.trackingData = trackingData;
			return this.request(AppConfig.API_ENDPOINTS.trackdata)
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
				,url: AppConfig.APPCONSTANTS_PROTOCOL + '//' + AppConfig.APPCONSTANTS_HOSTNAME + AppConfig.APPCONSTANTS_PORT + data.url
			})
			.then(
				function(successResponse){
					return successResponse.data;
				}
			);
		}
	}]
);
