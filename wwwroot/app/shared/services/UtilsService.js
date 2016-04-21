angular.module('app.ontdekJouwTalent')
.service('APIService','UtilsService',function(APIService,AppConfig){
	this.debug = function(data){
		if(AppConfig.APPCONSTANTS_ISLOCAL){
			return data;
		}
	}
})
