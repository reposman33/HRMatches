angular.module('app.HRMatches')
.service('SessionService',['APIService','store',function(APIService,store){
	var service = this,
		currentUser = null;
	
	// USER MANAGEMENT
	service.setCurrentUser = function(selectedToken){
		store.set('currentUser',{'token':selectedToken,'loginTime':new Date().getTime()});
	}

	service.resetLoginTimeOut = function(){
		var currentUser = service.getCurrentUser();
		currentUser.loginTime = new Date().getTime();
		store.set('currentUser',currentUser);
	}

	service.getCurrentUser = function(){
		return currentUser = store.get('currentUser');
	}

	service.getCurrentUserToken = function(){
		var currentUser = store.get('currentUser');
		var token = (currentUser && currentUser.token) || '';
		return token;
	}

	service.removeCurrentUser = function(){
		store.remove('currentUser');
	}
	
	service.isLoggedIn = function(){
		var currentUser;
		currentUser = store.get('currentUser');

		return (currentUser !== undefined && currentUser !== null);
	}

	// STORE MISC SESSION DATA
	service.get = function(key){
		var result = store.get(key);
		return result;
	}
	
	service.set = function(key,value){
		store.set(key,value);
	}

	service.log = function(message){
		// add messages to a log
		if(!store.get('log')){
			store.set('log',{})
		}
		var log = store.get('log');
		log[new Date().toLocaleString()] = message;
		store.set('log',log);

		//log client variables
		var data = {
			token: this.getCurrentUserToken(),
			hostname: location.hostname, //hostname van website
			href: location.href, // url (=incl protocol,port,hostname,querystring)
			appVersion: navigator.appVersion,//browser versie
			language: navigator.language, //browser taal
			platform: navigator.platform, //voor welk plaform is de browser
			userAgent: navigator.userAgent, //user agent
			screenSize: screen.width + '*' + screen.height, //breedte*hoogte van scherm
			colorDepth: screen.colorDepth //kleuren in bits/pixels
		}
		APIService.trackData(data)
	}
}])
