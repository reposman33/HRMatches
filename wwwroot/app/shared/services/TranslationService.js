angular.module('app.HRMatches')
.factory('TranslationService',['APIService','AppConfig',function(APIService,AppConfig){
	return{
		_translations: [],
		
		load: function(data){
			var self = this;
			return this._load(data)
			.then(
				function(I18nTexts){
					self.loadResponse(I18nTexts);
					return I18nTexts;
				},function(errorResponse){
					console.log('TranslationService.init() errorresponse: ', errorResponse);
				});
		},

		
		_load: function(data){
			return APIService.load(data)
			.then(
				function(successResponse){
					return successResponse.data;
				}
			);
		},
	
		
		loadResponse: function(translations){
			this._translations = translations;
		},

		getText: function(id){
			var result = id;

			angular.forEach(this._translations,function(obj,index,array){
				if(obj.id == id){
					result = obj.DisplayName;
					return;
				}
			});
			return result != "" ? result : id;
		},
		
		
		getData: function(){
			return this._translations;
		},
		
		updateTranslationKey : function(data){
			return APIService.updateTranslationKey(data)
			.then(
				function(successResponse){
					return successResponse.data;
				}
			)
		}
	}
}])