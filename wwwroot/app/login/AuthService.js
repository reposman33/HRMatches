angular.module('app.ontdekJouwTalent')
.factory('AuthService',['$state','APIService','AppConfig','SessionService',
	function($state,APIService,AppConfig,SessionService){

		return {

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
			
			register: function (data) {
				return APIService.register(data)
				.then(function (data) {
					return data;
				})
			}
		}
	}
])
