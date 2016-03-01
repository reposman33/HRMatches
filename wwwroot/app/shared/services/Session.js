angular.module('app.HRMatches')
.service('SessionService',function(store){
	var service = this,
		currentUser = null;
	
	service.setCurrentUser = function(userProfile){
		currentUser = userProfile;
		store.set(currentUser);
		return currentUser;
	}
	
	service.getCurrentUser = function(){
		if(!currentUser){
			currentUser = store.get('currentUser');
		} 
		return currentUser;
	}
	
	service.removeCurrentUser = function(){
		if(!currentUser){
			currentUser = store.get('currentUser');
		} 
		store.remove(currentUser);
		console.log('U are logged out!!!');
	}
	
	service.isLoggedIn = function(){
		var currentUser;
		currentUser = service.getCurrentUser();
		
		return (currentUser !== undefined && currentUser !== null);
	}
})
