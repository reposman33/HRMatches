/**
 * @ngdoc		service
 * @name		app.ontdekJouwTalent.service:JobsService
 * @description	This service contains functionality for Jobs (Vacatures)
 * @requires:	$http,AppConfig,SessionService
 * */
angular.module('app.ontdekJouwTalent')
	.factory('JobsService',['$filter','APIService','AppConfig',function($filter,APIService,AppConfig){
		return{
			_viewConfig: {},
			_cache: [],

			/*
			 * ========== PUBLIC METHODS ==========
			 */

			// LOAD
			/**
			 * @ngdoc			method
			 * @name			load
			 * @methodOf		app.ontdekJouwTalent.service:JobsService
			 * @description		Loads jobs (vacatures) for listView
			 * @returns {Array}	The list of jobs to display
			 */
			load: function(id){
				var self = this;

/*		Caching mechanism disabled
				if(this._isCached){
					// retrieve job from jobId
					if(id){
						job = self.getJob(id);
					}
					if(angular.isObject(job)){
						// found! return object
						return job;
					} // if not found, continue with Api call
				}
*/

				return APIService.call(AppConfig.API_ENDPOINTS.jobs,{jobId:id})
				.then(
					function(successResponse){
						//self.cacheResponse(successResponse);
						return successResponse;
					});
			},


			// CACHERESPONSE
			/**
			 * @ngdoc			method
			 * @name			cacheResponse
			 * @methodOf		app.ontdekJouwTalent.service:JobsService
			 * @description		caches a list of jobs
			 */
			cacheResponse: function(successResponse){
				if(angular.isArray(successResponse)){
					// if result is array we assume all jobs are requested. Overwrite cache contents
					this._cache = successResponse;
				}
				else if(angular.isObject(successResponse) && $filter('filter')(this._cache,successResponse,true).length == 0){
					// if result is a single object and not in cache, cache it
					this._cache.push(successResponse)
				}
				this._isCached = true;
				this._viewConfig = successResponse.configuration;
			},


			// GETJOB
			/**
			 * @ngdoc			method
			 * @name			getJob
			 * @methodOf		app.ontdekJouwTalent.service:JobsService
			 * @description		returns job specified by id
			 * @param {integer}	id of job
			 * @returns	{Object} a job
			 */
			getJob: function(id){
				angular.forEach(this._cache,function(obj,index,array){
					if(obj.id == id){
						result = obj;
					}
				});
				return result || undefined;
			},


			// GETDATA
			/**
			 * @ngdoc			method
			 * @name			getData
			 * @methodOf		app.ontdekJouwTalent.service:JobsService
			 * @description		returns all jobs from cache
			 * @returns	{Array} all jobs
			 */
			getData: function(){
				return this._cache;
			},


			/**
			 * @ngdoc method
			 * @name update
			 * @methodOf app.ontdekJouwTalent.service:JobsService
			 * @description update job [NOT IMPLEMENTED YET]
			 * @param {Object} the job to update.
			 */
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