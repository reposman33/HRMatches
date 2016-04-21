angular.module('app.ontdekJouwTalent')
.factory('AuthService',['$state','APIService','SessionService',
	function($state,APIService,SessionService){

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

		return {
			authenticate: function(data) {
				var parameters = extract(data);
				return APIService.authenticate(parameters);
			},


			login: function (data) {
				var parameters = extract(data);
				return APIService.login(parameters);
			},


			logout: function() {
				var token = SessionService.getCurrentUser().token;
				var parameters = extract({'tokens':token});
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
			forgotPassword: function (data) {
				return APIService.forgotPassword(data)
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
