angular.module('app.HRMatches')
.service('UtilsService',function(AppConfig){
	this.debug = function(data){
		if(AppConfig.APPCONSTANTS_ISLOCAL){
			return data;
		}
	}
})
