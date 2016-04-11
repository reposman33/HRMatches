angular.module('app.HRMatches')
.service('APIService','UtilsService',function(APIService,AppConfig){
	this.debug = function(data){
		if(AppConfig.APPCONSTANTS_ISLOCAL){
			return data;
		}
	}
})
