angular.module('app.HRMatches')
	.factory('JoblistService',['APIService','AppConfig',function(APIService,AppConfig){
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

				return APIService.request(data)
				.then(
					function(successResponse){
						self.loadResponse(successResponse);
						return successResponse;
					});
			},


			loadResponse: function(successResponse){
				this._data = successResponse;
			},


			getJob: function(id){
				var result = id;

				angular.forEach(this._data,function(obj,index,array){
					if(obj.id == id){
						result = obj;
						return;
					}
				});
				return result != "" ? result : id;
			},


			getData: function(){
				return this._data;
			},


			update : function(data){
				return APIService.updateJob(data)
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
				return APIService.request(data)
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
	}]
)