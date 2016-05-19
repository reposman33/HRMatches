angular.module('app.ontdekJouwTalent')
.service('SessionService',['store',function(store){
	var service = this,
		currentUser = null;
	
	service.setCurrentUser = function(user){
		user.loginTime = new Date();
		store.set('currentUser',user);
	}

	// GET USER DATA
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

	service.getCurrentUserName = function(){
		var currentUser = store.get('currentUser');
		return currentUser.username;
	}

	service.removeCurrentUser = function(){
		store.remove('currentUser');
	}
	
	service.isLoggedIn = function(){
		var currentUser;
		currentUser = store.get('currentUser');

		return (currentUser !== undefined && currentUser !== null);
	}

	service.getCurrentUserProfile = function(){
		var currentUser = store.get('currentUser');
		var userProfile = currentUser.userProfile.domainName + ' (' + currentUser.userProfile.domainOwner + ') ' + currentUser.userProfile.website
		return userProfile;
	}

	service.getCurrentUserPersonId = function(){
		var currentUser = store.get('currentUser');
		return currentUser.userProfile.personId;
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
