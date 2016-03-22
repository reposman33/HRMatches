angular.module('app.HRMatches')
.factory('I18nService',['$http','AppConfig',function($http,AppConfig){
	return{
		_I18nTexts: [],
		
		init: function(){
			return $http({
				method:'POST',
				url: AppConfig.APP_API_URL + '/translation',
				data:{
					language: 'en_US',
					languageKey: ''
					}
			})
			.then(
				function(successResponse){
					return successResponse.data;
				},
				function(errorResponse){
					console.log(errorResponse);
				}
			);
		},

		
		loadData: function(I18nResponse){
			this._I18nTexts = I18nResponse;
		},

		getText: function(id){
			var result = id;

			angular.forEach(this._I18nTexts,function(obj,index,array){
				if(obj.id == id){
					result = obj.DisplayName;
					return;
				}
			});
			return result != "" ? result : id;
		}
	}
}])