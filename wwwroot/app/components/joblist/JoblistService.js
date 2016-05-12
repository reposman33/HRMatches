/**
 * @ngdoc		service
 * @name		app.ontdekJouwTalent.service:JoblistService
 * @description	This service contains functionality for Jobs (Vacatures)
 * @requires:	$http,AppConfig,SessionService
 * */
angular.module('app.ontdekJouwTalent')
	.factory('JoblistService',['APIService','AppConfig',function(APIService,AppConfig){
		return{
			_viewConfig: {},
			_isLoaded: false,
			_data: [],

			/*
			 * ========== PUBLIC METHODS ==========
			 */

			// LOAD
			/**
			 * @ngdoc			method
			 * @name			load
			 * @methodOf		app.ontdekJouwTalent.service:JoblistService
			 * @description		Loads jobs (vacatures) for listView
			 * @returns {Array}	The list of jobs to display
			 */
			load: function(){
				var self = this;

				if(self._isLoaded){
					return this.getData();
				}

				return APIService.call(AppConfig.API_ENDPOINTS.joblist)
				.then(
					function(successResponse){
						self.cacheResponse(successResponse);
						return successResponse;
					});
			},


			// CACHERESPONSE
			/**
			 * @ngdoc			method
			 * @name			cacheResponse
			 * @methodOf		app.ontdekJouwTalent.service:JoblistService
			 * @description		caches a lsit of jobs 
			 */
			cacheResponse: function(successResponse){
				this._data = successResponse.data;
				this._viewConfig = successResponse.configuration;
			},



			// GETJOB
			/**
			 * @ngdoc			method
			 * @name			getJob
			 * @methodOf		app.ontdekJouwTalent.service:JoblistService
			 * @description		returns job specified by id
			 * @returns	{Object} a job
			 */
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
							return successResponse;
						}
					)
			}
		}
	}]
)