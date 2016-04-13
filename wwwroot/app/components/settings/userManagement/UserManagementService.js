angular.module('app.HRMatches')
.factory('UserManagementService',['APIService','AppConfig',
	function(APIService,AppConfig){
		return{
			settingsData: {}
			,assignRight: function(data){
				console.log('Setting right: ',data.name,' to ',data.value);
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
