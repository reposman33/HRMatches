angular.module('app.ontdekJouwTalent')
.factory('AuthService',['$state','APIService','AppConfig','SessionService',
	function($state,APIService,AppConfig,SessionService){

/*
		// TRANSFORM A KEY-VALUE PAIR IN AN OBJECT WITH KEYS 'NAME' AND 'VALUE' WITH THE ORIGINAL VALUES
		function extract(data){
			var result = [];
			angular.forEach(data,function(value,key){
				result.push({
					'name': key,
					'value': value
				});
			});
			return result;
		}
*/

		return {
			authenticate: function(data) {
				return APIService.authenticate(data);
			},


			login: function (data) {
				return APIService.login(data);
			},


			logout: function() {
				var parameters = {'tokens':SessionService.getCurrentUser().token};
				return APIService.logout(parameters)
				.catch(
					function(errorResponse){
						console.error(errorResponse);
					}
				)
				.finally(
					function(errorResponse){
						SessionService.removeCurrentUser();
					}
				)
			},

			// chaining promises http://solutionoptimist.com/2013/12/27/javascript-promise-chains-2/
			//data = {hostName:...,emailAddress:...}
			forgotPassword: function(data) {
				data.hostname = AppConfig.APPCONSTANTS_HOSTNAME;
				_data = {};
				_data.parameters = extract(data);
				_data.addToken = AppConfig.API_ENDPOINTS.forgotPassword.addToken;
				_data.endpoint = AppConfig.API_ENDPOINTS.forgotPassword.endpoint;
				_data.method = AppConfig.API_ENDPOINTS.forgotPassword.method
				return APIService.forgotPassword(_data)
				.then(function (data) {
					return data;//{validate_ok:true/false,message:I18nKey}
				});
			},

			//data = {passwordResetToken:...}
			validateSecretKey: function (key) {
				return APIService.validateSecretKey(encodeURIComponent(key))
				.then(
					function (successResponse) {
						SessionService.set('secretKey', $stateParams.key);
						return {validate_ok: successResponse.tokenIsValid}
					}
					, function (errorResponse) {
						SessionService.set('secretKey', $stateParams.key);
						return {
							validate_ok: false
							, message: (errorResponse.ERROR ? errorResponse.ERROR : '')
						}
					}
				)
			},

			resetPassword: function (data) {
				//data = {password:...,passwordResetToken:...}
				return APIService.resetPassword(data)
				.then(function (data) {
					return data; // {update_OK:...}}
				})
			},

			register: function (data) {
				return APIService.register(data)
				.then(function (data) {
					return data;
				})
			}
		}
	}
])
