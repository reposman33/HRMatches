angular.module('app.HRMatches')
.factory('UserManagementService',['APIService','AppConfig',
	function(APIService,AppConfig){
		return{
			settingsData: {}
			,assignRight: function(data){
				console.log('Setting right: ',data.name,' to ',data.value);
			}
            
			// RETRIEVE DATA FOR SETTINGS PAGE
			,loadSettingsData: function(data){
				return this.requestLocalJSON(data)
					.then(
						function(successResponse){
							this.settingsData = successResponse.data;
							return successResponse;
						}
					)
					.catch(function(errorResponse){
						console.error('Error in UserManagementService.getSettingsData(): ',errorResponse);
					})
			}


            ,requestLocalJSON: function(data){
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
