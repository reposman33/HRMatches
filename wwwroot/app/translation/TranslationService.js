angular.module('app.ontdekJouwTalent')
.factory('TranslationService',['APIService','AppConfig',function(APIService,AppConfig){
	return{
		_translationsData: {},
		_data: [],
		_viewConfig: {},
		_isLoaded: false,

		/*
		 * ========== PUBLIC METHODS ==========
		 */

		load: function(API){
			var self = this;

			return APIService.call(API)
			.then(
				function(successResponse){
					self.loadResponse(successResponse);
					self._isLoaded = true;
					return successResponse;
				}
			);
		},


		loadResponse: function(successResponse){
			this._translationsData = successResponse;
			this._data = successResponse.data;
			this._viewConfig = successResponse.configuration;
		},


		getText: function(id){
			var result = id;

			angular.forEach(this._data,function(obj,index,array){
				if(obj.id == id){
					result = obj.DisplayName;
					return;
				}
			});
			return result != "" ? result : id;
		},


		getData: function(){
			return this._translationsData;
		},


		//TODO implement method updateTranslation()
		updateTranslation: function(data){
			return APIService.call(AppConfig.API_ENDPOINTS.updateTranslation,data);
		}
	}
}])