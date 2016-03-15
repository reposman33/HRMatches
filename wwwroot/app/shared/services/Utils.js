angular.module('app.HRMatches')
.service('UtilsService',function(AppConfig){
	this.debug = function(data){
		if(AppConfig.APP_ISLOCAL){
			return data;
		}
	}
})
