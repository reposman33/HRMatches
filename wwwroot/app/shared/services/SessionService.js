angular.module('app.ontdekJouwTalent')
.service('SessionService',['store',function(store){
	var service = this,
		currentUser = null;
	
	// USER MANAGEMENT
	service.setCurrentUser = function(user){
		user.loginTime = new Date();
		store.set('currentUser',user);
	}

/*	service.resetLoginTimeOut = function(){
		var currentUser = service.getCurrentUser();
		currentUser.loginTime = new Date().getTime();
		store.set('currentUser',currentUser);
	} */

	service.getCurrentUser = function(){
		return currentUser = store.get('currentUser');
	}

	service.getCurrentUserToken = function(){
		var currentUser = store.get('currentUser');
		return (currentUser && currentUser.token) || '';
	}

	service.getCurrentUserDomainId = function(){
		var currentUser = store.get('currentUser');
		return currentUser.domainId;
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
		var value = store.get(key);
		return value;
	}
	
	service.set = function(key,value){
		store.set(key,value);
	}

	// convenience method for remove
	service.delete = function(key){
		service.remove(key);
	}

	service.remove = function(key){
		store.remove(key);
	}


	service.log = function(message){
		// add messages to a log
		if(!store.get('log')){
			store.set('log',{})
		}
		var log = store.get('log');
		log[new Date().toLocaleString()] = message;
		store.set('log',log);
	}
}]);
