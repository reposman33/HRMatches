angular.module('app.HRMatches')
.service('APIService',function($http,$timeout,$q,$state,$q,AppConfig){

	this.authenticate = function(data){
		return $http({
			method: 'POST',
			url: AppConfig.APP_API_URL + '/authenticate',
			data: data
		})
	}

	this.logout = function(tokens){
		return $http({
			method: 'POST',
			url: AppConfig.APP_API_URL + '/logout/',
			data: {
				'tokens':tokens
			}
		})
	}

	this.validateTokens = function(tokens){
		var promises = tokens.map(function(token,i,tokens){
			return $http({
				method: 'GET',
				url: AppConfig.APP_API_URL + '/validate_token/' + token
			});
		})

		return $q.all(promises);
	}

	// FORGOTPASSWORD
	this.forgotPassword = function(data){
		return $http({
			method: 'POST',
			url: AppConfig.APP_API_URL + '/forgotpassword',
			data: {
				hostname: data.hostName,
				emailaddress: data.emailAddress
			}
		})
	}

	this.validateSecretKey = function(secretKey){
		return $http({
			method: 'POST'
			,url: AppConfig.APP_API_URL + '/validate_secretkey'
			,data:{
				secretkey: secretKey
			}
		})
	}

	this.validateSecretKeyMock = function(secretKey){
		var deferred = $q.defer();
		$timeout(function(){
			deferred.resolve({data:{validate_ok:secretKey.validate_ok,message:secretKey.message}}),
			3000
		});

		return deferred.promise;
	}

	this.resetPassword = function(data){
		return $http({
			method: 'POST',
			url: AppConfig.APP_API_URL + '/resetpassword',
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
	
	this.loadTranslations = function(data){
		return $http({
			method:'POST'
			,url: AppConfig.APP_API_URL + '/translation'
			,data:{
				language: data.language
				,languageKey: data.languageKey
			}
		})	
	}
	
	this.loadLanguages = function(){
		return $http({
			method: 'GET'
			,url: AppConfig.APP_API_URL + '/language'
		})		
	}
	
	this.loadTranslationCategories = function(){
		return $http({
			method: 'GET'
			,url: AppConfig.APP_API_URL + '/translationCategory'
		})
	}
})
