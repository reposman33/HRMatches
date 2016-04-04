angular.module('app.HRMatches')
.factory('TranslationService',['APIService','AppConfig',function(APIService,AppConfig){
	return{
		_translationsData: {},
		_data: [],
		_viewConfig: {},
		__isLoaded: false,

		/*
		 * ========== PUBLIC METHODS ==========
		 */

		load: function(data){
			var self = this;

			if(this._isLoaded()){
				return this.getData();
			}

			return this._load(data)
			.then(
				function(successResponse){
					self.loadResponse(successResponse);
					self._isLoaded(true);
				});
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


		updateTranslationKey : function(data){
			return APIService.updateTranslationKey(data)
				.then(
					function(successResponse){
						return successResponse.data;
					}
				)
		},

		/*
		* ========== PRIVATE METHODS ==========
		*/

		_load: function(data){
			return APIService.load(data)
			.then(
				function(successResponse){
					return successResponse.data;
				}
			);
		},


		_isLoaded: function(status){
			if(status){
				this.__isLoaded = status;
			}
			else{
				return this.__isLoaded;
			}
		}
	}
}])