angular.module('app.HRMatches',['angular-storage','ui.bootstrap','ui.router','xeditable'])
.constant('AppConfig',{
	// APPLICATION DEFINED VALUES
	APPCONSTANTS_HOSTNAME: location.hostname
	,APPCONSTANTS_ISLOCAL: "127.0.0.1".indexOf(location.hostname) != -1
	,APPCONSTANTS_NAVIGATION_CURRENTDOMAIN: document.location.protocol + '://' + document.location.hostname
	,APPCONSTANTS_PROTOCOL: location.protocol
	,APPCONSTANTS_FILELOCATIONS_VIEWS: {
		NAVIGATIONBAR: '/app/components/navigation/views/navigation.html'
		,TABLEVIEW: '/app/shared/views/tableView.html'
	}

	// TEMP CONSTANTS TO BE DEFINED BY BACK END
	,APPCONSTANTS_API_URL: 'http://api-development.hrmatches.com'
	,APPCONSTANTS_PUBLICSTATES: "login,login.forgotPassword,login.userProfiles,login.resetPassword,login.register" // exclusively public states
	,APPCONSTANTS_NAVIGATION_ENTRYPOINT: 'editTranslation'
	,APPCONSTANTS_NAVIGATION_REDIRECT: {
		NOTAUTHENTICATED:'login' // redirect hiernaartoe als niet ingelogd
		,SETTINGS:'settings.userManagement.rechtenEnRollen'
	}

	,API_ENDPOINTS: {
		'translation': {
			endpoint: 'translation'
			,method: 'POST'
			,addToken: false
			,parameters: [{
				name: 'language'
				,value: 'nl_NL'
			},{
				name:'languageKey'
				,value: ''
			}]
		}
		,'joblist': {
			endpoint: 'joblist'
			,method: 'GET'
			,addToken: true
			,parameters: []
		}
		,'trackdata': {
			endpoint: 'trackdata'
			,method: 'POST'
			,addToken: false
			, parameters: [{
				name: 'trackingdata'
				,value: {
					'token': '' // value injected later
					,'state': '' // value injected later
					,'protocol': location.protocol
					,'hostname': location.hostname //hostname van website
					,'href': location.href // url (=incl protocol,port,hostname,querystring)
					,'appVersion': navigator.appVersion //browser versie
					,'language': navigator.language //browser taal
					,'platform': navigator.platform //voor welk plaform is de browser
					,'userAgent': navigator.userAgent //user agent
					,'screenSize': screen.width + '*' + screen.height //breedte*hoogte van scherm
					,'colorDepth': screen.colorDepth + "" //kleuren in bits/pixels
				}
			}]
		},'registration': {
			endpoint: 'registration'
			,method: 'POST'
			,addToken: false
			,parameters: [{
				name: 'data'
				,value: {
					firstName: '' // value injected later
					,infix: '' // value injected later
					,username: '' // value injected later
					,password: '' // value injected later
					,candidateOrigin: '' // value injected later
					,emailaddress: '' // value injected later
					,lastName: '' // value injected later
					,personId: '' // value injected later
				}
			}]
		}
		,'settings': {
			'userManagement': {
				'users': {
					endpoint: 'userManagement-users'
					,method: 'GET'
					,addToken: 'true'
					,parameters: []
				},
				'invited': {
					endpoint: 'userManagement-invited'
					,method: 'GET'
					,addToken: 'true'
					,parameters: []
				},
				'rightsAndsRoles': {
					endpoint: 'userManagement-rightsAndsRoles'
					,method: 'GET'
					,addToken: 'true'
					,parameters: []
				},
				'teams': {
					endpoint: 'userManagement-teams'
					,method: 'GET'
					,addToken: 'true'
					,parameters: []
				},
				'jobpool': { // vacaturePool
					endpoint: 'userManagement-jobpool'
					,method: 'GET'
					,addToken: 'true'
					,parameters: []
				}
			}
		}
	}
}) //END constant
.run(function($rootScope,$state,APIService,AppConfig,AuthService,TranslationService,SessionService){
	// perform any site-wide initialisation here
	$rootScope.AppConfig = AppConfig;
	$rootScope.$state = $state;
	$rootScope.TranslationService = TranslationService;
	$rootScope.SessionService = SessionService;

	// RETRIEVE TRANSLATION
	TranslationService.load(AppConfig.API_ENDPOINTS.translation)
	.then(
		function(successResponse){
			console.log('Translation loaded');
		}
	);

	$rootScope.$on('$stateChangeStart',function(event, toState, toParams, fromState, fromParams, options){
		var currentUser = SessionService.getCurrentUser();

		if(!currentUser){ // USER NOT LOGGED IN
			if(AppConfig.APPCONSTANTS_PUBLICSTATES.indexOf(toState.name) == -1){
				// REQUESTING PROTECTED STATE
				console.warn('User not logged in, redirecting');
				//REDIRECT TO LOGIN
				$state.go(AppConfig.APPCONSTANTS_NAVIGATION_REDIRECT.NOTAUTHENTICATED);
				event.preventDefault();
			}
		}
		else if(AppConfig.APPCONSTANTS_PUBLICSTATES.indexOf(toState.name) > -1){
			//USER LOGGED IN, ACCESSING PUBLIC STATE (e.g. 'login', 'register')
			$state.go(AppConfig.APPCONSTANTS_NAVIGATION_ENTRYPOINT);
			event.preventDefault();
		}
	});

	$rootScope.$on('$stateChangeSuccess',function(event, toState, toParams, fromState, fromParams, options){
		APIService.trackData(toState.name);
	});

	$rootScope.$on('$stateChangeError',function(event, toState, toParams, fromState, fromParams, error){
		switch(error.status){
			case 500:{ // server error
				SessionService.log(error);
				break;
			}
			case 501:{ // login error
				SessionService.log(error);
				break;
			}
			case 401:{ //niet authenticated
				SessionService.log(error);
				$state.go(APPCONSTANTS_NAVIGATION_REDIRECT.NOTAUTHENTICATED);
				break;
			}
			case 403:{ // niet geauthoriseerd
				SessionService.log(error);
				$state.go('message',{message:'U bent niet geauthoriseerd voor deze actie!'});
				break;
			}
		}
		event.preventDefault();
		console.error('ERROR $stateChangeError! fromState:',fromState,' toState:',toState,' error:',error);
	});

}) // END run
.config(['$stateProvider','$urlRouterProvider','AppConfig',function($stateProvider,$urlRouterProvider,AppConfig) {
	$urlRouterProvider
		.otherwise(function($injector,$location){
			return '/login';
		}) // REDIRECT
		.when('/settings',function($state){
			$state.go(AppConfig.APPCONSTANTS_NAVIGATION_REDIRECT.SETTINGS);
		});

	$stateProvider
		.state('home', {
			views: {
				'header': {
					templateUrl: AppConfig.APPCONSTANTS_FILELOCATIONS_VIEWS_NAVIGATIONBAR,
					controller: 'AuthController'
				}
			}
			, abstract: true
		})
		.state('message', {
			url: '/message/',
			params: {
				message: null
				, fromStateName: ''
			},
			views: {
				'body': {
					controller: function ($scope, $stateParams, TranslationService) {
						$scope.message = TranslationService.getText($stateParams.message);
						$scope.fromStateName = $stateParams.fromStateName;
					},
					templateUrl: '/app/shared/views/message.html'
				}
			}
		})
		.state('modal-backdrop', {
			views: {
				'modal': {
					templateUrl: '/app/shared/views/modal-backdrop.html'
				}
			}
		})
		/*
		 * ========== LOGIN ==========
		 */
		.state('login', {
			url: '/login'
			,views: {
				'body': {
					templateUrl: '/app/components/login/views/login.html'
					, controller: 'AuthController'
				}
			}
		})
		/*
		 *    ========== USERPROFILES ==========
		 */
		.state('login.userProfiles', {
			url: '/userProfiles'
			,templateUrl: '/app/components/login/views/userProfiles.html'
			,onEnter: ['$state', '$uibModal', function ($state, $uibModal) {
				$uibModal.open({
					templateUrl: '/app/components/login/views/userProfiles.html',
					controller: ['$scope','$uibModalInstance',function($scope,$uibModalInstance){
						$scope.close = function(reason){
							$uibModalInstance.$dismiss();
						}
					}]
				}).result.finally(function () {
					$state.go('^');
				});
			}]
			,onExit: [function(){

			}]
		})
		/*
		 * ========= FORGOTPASSWORD =========
		 */
		.state('login.forgotPassword', {
			url: '/forgotPassword'
			,templateUrl: '/app/components/login/views/forgotPassword.html'
		})
		/*
		 * ========= RESETPASSWORD =========
		 */
		.state('login.resetPassword', {
			url: '/resetPassword/:key'
			,templateUrl: '/app/components/login/views/resetPassword.html'
			,resolve: {
				validateResponse: function ($stateParams, AuthService) {
					return AuthService.validateSecretKey($stateParams.key);
				}
			}
			,onEnter: function ($rootScope, APIService) {
				if (validateResponse.validate_ok == false) {
					$stateProvider.go('message', {message: (!validateResponse.message ? 'Token invalid' : validateResponse.message)});
				}
			}
		})
		/*
		 * ========= LOGOUT =========
		 */
		.state('logout', {
			url: '/logout'
			,views: {
				'body': {
					templateUrl: '/app/components/login/views/logout.html'
					, controller: 'AuthController'
				}
			}
		})
		.state('login.2StepAuthentication', {
			url: '2StepAuthentication'
			,templateUrl: '/app/components/login/views/2stepAuthentication.html'
		})
		/*
		 * ========= REGISTER =========
		 */
		.state('login.register', {
			url: '/register'
			,templateUrl: '/app/components/register/views/register.html'
		})
		/*
		 * ========= VACATUREGIDS =========
		 */
		.state('vacaturegids', {
			url: '/vacaturegids'
			,views: {
				'body@': {
					templateUrl: '/app/components/vacaturegids/views/vacaturegids.html'
				}
				, 'header': {
					templateUrl: AppConfig.APPCONSTANTS_FILELOCATIONS_VIEWS_NAVIGATIONBAR
					, controller: 'AuthController'
				}
			}
		})
		/*
		 * ========= TRANSLATION =========
		 */
		.state('editTranslation', {
			url: '/editTranslation'
			,resolve: {
				data: ['TranslationService', function (TranslationService) {
					return TranslationService.load(AppConfig.API_ENDPOINTS.translation);
				}]
			}
			,views: {
				'body': {
					templateUrl: '/app/components/translation/views/editTranslation.html'
					,controller: 'TranslationController'
				}
			}
		})
		/*
		 * ========= JOBLIST =========
		 */
		.state('joblist', {
			url: '/joblist'
			,resolve: {
				data: ['JoblistService', function (JoblistService) {
					return JoblistService.load(AppConfig.API_ENDPOINTS.joblist);
				}]
			}
			, views: {
				'body': {
					templateUrl: '/app/components/joblist/views/jobs.html'
					,controller: 'JoblistController'
				}
			}
		})
		/*
		 * ========= SETTINGS =========
		 */
		.state('settings', {
			url: '/settings'
			,resolve: {
				settingsData: ['UserManagementService', function (UserManagementService) {
					return UserManagementService.requestLocalJSON({
						method: 'GET'
						,url: '/app/components/settings/dummyData.json'
					})
				}]
			}
			,views: {
				'body@': {
					templateUrl: '/app/components/settings/views/container.html'
					,controller: 'SettingsController'
				}
			}
		})
		// ---------- SETTINGS.USERMANAGEMENT ----------
		.state('settings.userManagement', {
			url: '/userManagement'
			,resolve: {
				data: function(){
					return {
						data:{
							configuration:{}
							,data:[]
						}
					}
				}
			}
			,views: {
				'setting@settings': {
					templateUrl: '/app/components/settings/userManagement/views/userManagementContainer.html'
					,controller: 'UserManagementController'
				}
			}
		})
		// ---------- SETTINGS.USERMANAGEMENT.gebruikers----------
		.state('settings.userManagement.gebruikers', {
			url:'/gebruikers'
			,resolve: {
				data: function(){
					return {
						data:{
							configuration:{}
							,data:[]
						}
					}
				}
			}
		})
		// ---------- SETTINGS.USERMANAGEMENT.uitgenodigd----------
		.state('settings.userManagement.uitgenodigd', {
			url:'/uitgenodigd'
			,resolve: {
				data: function(){
					return {
						data:{
							configuration:{}
							,data:[]
						}
					}
				}
			}
		})
		// ---------- SETTINGS.USERMANAGEMENT.RECHTENENROLLEN----------
		.state('settings.userManagement.rechtenEnRollen', {
			url: '/rechtenEnRollen'
			,resolve: {
				data: ['UserManagementService', function (UserManagementService) {
					return UserManagementService.requestLocalJSON({
						method: 'GET'
						,url: '/app/components/settings/userManagement/rechtenEnRollen/listViewData.json'
					})
				}]
				}
			,views: {
				'tabContent@settings.userManagement': {
					controller: 'UserManagementController'
					,templateUrl: '/app/components/settings/userManagement/rechtenEnRollen/views/listView.html'
				}
			}
		})
		// ---------- SETTINGS.USERMANAGEMENT.TEAMS ----------
		.state('settings.userManagement.listTeams', {
			url: '/listTeams'
			,resolve: {
				data: ['UserManagementService', function(UserManagementService) {
					return UserManagementService.requestLocalJSON({
						method: 'GET'
						,url: '/app/components/settings/userManagement/teams/listViewData.json'
					})
				}]
			}
			,views: {
				'tabContent@settings.userManagement': {
					controller: 'UserManagementController'
					,templateUrl: '/app/components/settings/userManagement/teams/views/listView.html'
				}
			}
		})
	// ---------- SETTINGS.USERMANAGEMENT.vacaturePool----------
		.state('settings.userManagement.vacaturePool', {
			url:'/vacaturePool'
			,resolve: {
				data: function(){
					return {
						data:{
							configuration:{}
							,data:[]
						}
					}
				}
			}
		})
}]);