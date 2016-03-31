angular.module('app.HRMatches')
.factory('TranslationService',['APIService','AppConfig',function(APIService,AppConfig){
	return{
		_data: [],

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
					return successResponse;
				},function(errorResponse){
					console.log('TranslationService.init() errorresponse: ', errorResponse);
				});
		},


		loadResponse: function(successResponse){
			this._data = successResponse;
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
			return this._data;
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


		_isLoaded: function(){
			return this._data.length > 0;
		}
	}
}])