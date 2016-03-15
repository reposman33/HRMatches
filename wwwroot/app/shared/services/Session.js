angular.module('app.HRMatches')
.service('SessionService',function(store){
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
		currentUser = store.get('currentUser');
		return currentUser.token;
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
	
})
