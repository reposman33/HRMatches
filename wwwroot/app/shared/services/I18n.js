angular.module('app.HRMatches')
.factory('I18nService',['APIService','AppConfig',function(APIService,AppConfig){
	return{
		_I18nTexts: [],
		
		loadTranslations: function(data){
			return APIService.loadTranslations(data)
			.then(
				function(successResponse){
					return successResponse.data;
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
		},
		
		
		loadLanguages: function(){
			return APIService.loadLanguages()
			.then(
				function(successResponse){
					return successResponse.data
				}
			)
		},
		
		loadTranslationCategories: function(){
			return APIService.loadTranslationCategories()
			.then(
				function(successResponse){
					return successResponse.data;
				}
			)
		},
		
		getData: function(){
			if(this._I18nTexts.length.length==0){
				this.loadTranslation(
					{
						language: AppConfig.APP_TRANSLATIONS_DEFAULTISOLANGUAGE
						,languageKey: AppConfig.APP_TRANSLATIONS_DEFAULTLANGUAGEKEY
					}
				)
				then(
					function(successResponse){
						this._I18nTexts = successResponse;
				})
			}
			return this._I18nTexts;
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