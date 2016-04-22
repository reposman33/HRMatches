angular.module('app.ontdekJouwTalent')
.factory('UserManagementService',['APIService','AppConfig',
	function(APIService,AppConfig){
		return{
			settingsData: {}
			,assignRight: function(data){
				console.log('Setting right: ',data.name,' to ',data.value);
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
