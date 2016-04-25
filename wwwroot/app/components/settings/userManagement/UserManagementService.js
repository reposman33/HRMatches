angular.module('app.ontdekJouwTalent')
.factory('UserManagementService',['APIService','AppConfig',
	function(APIService,AppConfig){
		return{
			settingsData: {}

			,permissions: function(data){
				return APIService.permissions()
				.then(
					function(successResponse){
						return successResponse.data;
					}
				)
				.catch(function(errorResponse){
					console.error('ERROR in UserManagementService.permissions: ',errorResponse)
				})
			}


			,roles: function(data){
				return APIService.roles()
				.then(
					function(successResponse){
						return successResponse.data;
					}
				)
				.catch(function(errorResponse){
					console.error('ERROR in UserManagementService.roles: ',errorResponse)
				})
			}


			,load: function(data){
                return APIService.request(data)
	                .then(
		                function(succesResponse){
			                return succesResponse.data;
		                }
	                )
	                .catch(
		                function(errorResponse){
			                console.error('ERROR in APIService.requestLocal: ',errorResponse);
			                return;
		                }
	                )
            },

            requestLocalJSON:  function(data){
                return APIService.requestLocalJSON(data)
                .then(
	                function(succesResponse){
		                return succesResponse;
	                }
                )
                .catch(
	                function(errorResponse){
		                console.error('ERROR in APIService.requestLocal: ',errorResponse);
	                }
                )
            }


			,getSettingsData: function(){
				return this.settingsData;
			}
         }
	}
]);
