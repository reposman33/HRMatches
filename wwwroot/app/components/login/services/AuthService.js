angular.module('app.ontdekJouwTalent')
.factory('AuthService',['$state','APIService','AppConfig','SessionService',
	function($state,APIService,AppConfig,SessionService){

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
				return APIService.forgotPassword(data)
				.then(function (successResponse) {
					return successResponse;//{validate_ok:true/false,message:I18nKey}
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
				)
			},

			resetPassword: function(data) {
				return APIService.resetPassword(data)
				.then(
					function (data) {
						return data;
					}
				)
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
