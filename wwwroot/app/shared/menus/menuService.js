angular.module('app.ontdekJouwTalent')
.service('MenuService',['$rootScope','APIService','SessionService',function($rootScope,APIService,SessionService){
	// constructor area, do here one-time initialisations

	/*
	* when Api /menu is ready, replace 'requestLocalJSON()' with call below
	* ApiService.getMenu(SessionService.getCurrentUserToken(),'topNav')
	*
	* */

	function getMenu(context){

		// when Api /menu  is implemented call looks like this for menus in context of top navigation bar:
		// return APIService.call({endpoint: 'menu',method:'GET'},{context:context})
		
		switch(context){
			case 'TopNav':
				url = '/app/shared/menus/TopNavMenuData.json';
				break;
			
			case 'Settings':
				url = '/app/shared/menus/SettingsMenuData.json';
				break;
		}
		return APIService.requestLocalJSON({url:url})
			.then(
				function(successResponse){
						return successResponse;
				}
			)
		}

	function retrieveSubMenuByParentUrl(menu,parentUrl){
		var result = [];
		menu.map(
			function(currentMenu,index,menu){
				if(currentMenu.url === parentUrl){
					result = currentMenu.items;
					return;
				}
			}
		)
		return result;
	}

	return {
		getMenu:getMenu,

		retrieveSubMenuByParentUrl: retrieveSubMenuByParentUrl

	}

}])