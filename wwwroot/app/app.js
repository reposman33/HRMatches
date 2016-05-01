angular.module('app.ontdekJouwTalent',['angular-storage','ui.bootstrap','ui.router','ui.router.modal','xeditable','angular-confirm'])
.constant('AppConfig',{
	// APPLICATION DEFINED VALUES
	APPCONSTANTS_HOSTNAME: location.hostname
	,APPCONSTANTS_ISLOCAL: "127.0.0.1,ontdekjouwtalent.local,ojt.hrmatches.com".indexOf(location.hostname) != -1
	,APPCONSTANTS_NAVIGATION_CURRENTDOMAIN: document.location.protocol + '://' + document.location.hostname
	,APPCONSTANTS_RESOURCES_URIS:{
		DOCUMENTATION: document.location.protocol + '//' + document.location.hostname + '/documentation'
	}
	,APPCONSTANTS_PROTOCOL: location.protocol
	,APPCONSTANTS_FILELOCATIONS_VIEWS: {
		NAVIGATIONBAR: '/app/components/navigation/views/navigation.html'
		,TABLEVIEW: '/app/shared/views/tableView.html'
	}
	,APPCONSTANTS_DEVICEID: ''

	// TEMP CONSTANTS TO BE DEFINED BY BACK END
	,APPCONSTANTS_API_URL: 'http://api-development.hrmatches.com'
	,APPCONSTANTS_PUBLICSTATES: "login,login.forgotPassword,login.userProfiles,login.resetPassword,login.register" // exclusively public states
	,APPCONSTANTS_NAVIGATION_ENTRYPOINT: 'editTranslation'
	,APPCONSTANTS_NAVIGATION_REDIRECT: {
		NOTAUTHENTICATED:'login' // redirect hiernaartoe als niet ingelogd
		,SETTINGS:'settings.userManagement.rechtenEnRollen'
	}
	,APPCONSTANTS_SETTINGS_USERMANAGEMENT_ROLE: { // TEMPLATE FOR SETTINGS-USERMANAAGEMENT-RIGHTS_AND_ROLES ADD NEW ROLE
		id: 0
		,systemName: 'New Role'
		,token:''
	}
	,APPCONSTANTS_SETTINGS_USERMANAGEMENT_TEAM: { // TEMPLATE FOR SETTINGS-USERMANAAGEMENT-TEAM ADD NEW TEAM
		id: 0
		,MEMBERS: []
		,displayName: 'New Team'
		,token:''
	}
	,API_ENDPOINTS: {
		'translation': {			// ===== LEGENDA =====
			endpoint: 'translation'	// endpoint to use for call to API
			,method: 'POST'			// http method to use
			,addToken: false		// wether to add or not a user token (supplied at login) to the API call
			,columnNames: {         // reference to columnames so we use different columnames in same shared view
				'displayName':'DisplayName'
				,'id':'id'
			}
			,parameters: {			// parameters defined by user's permissions are supplied by API
				language: 'nl_NL'
				,languageKey: ''
			}
		}
		,'updateTranslation': {
			endpoint: 'updateTranslation'
			,method: 'POST'
			,addToken: true
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
			, parameters: {
				'trackingData': {
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
					,'colorDepth': screen.colorDepth + '' //kleuren in bits/pixels
				}
			}
		},'registration': {
			endpoint: 'registration'
			,method: 'POST'
			,addToken: false
			,parameters: {data: { // custom format needed to inject dynamic values later in APIService
					firstName: '' // value injected later
					,infix: '' // value injected later
					,username: '' // value injected later
					,password: '' // value injected later
					,candidateOrigin: '' // value injected later
					,emailaddress: '' // value injected later
					,lastName: '' // value injected later
					,personId: '' // value injected later
				}
			}
		}
		,'settings': {
			'userManagement': {
				'users': {
					endpoint: 'users'
					,method: 'GET'
					,addToken: true
					,parameters: []
				}
				,'invited': {
					endpoint: 'userManagement-invited'
					,method: 'GET'
					,addToken: true
					,parameters: []
				}
				,'roles': {
					endpoint: 'role'
					,method: 'GET'
					,addToken: true
					,parameters: []
				}
				,'permissions': {
					endpoint: 'permission'
					,method: 'GET'
					,addToken: true
					,parameters: []
				}
				,'teams': {
					endpoint: 'teams'
					,method: 'GET'
					,addToken: true
					,columnNames: {
						'displayName':'DisplayName'
						,'id':'id'
					}
					,parameters: []
				}
				,'jobpool': { // vacaturePool
					endpoint: 'userManagement-jobpool'
					,method: 'GET'
					,addToken: true
					,parameters: []
				}
				,'updateRolesAndPermissions': {
					endpoint: 'role'
					,method: 'PUT'
					,addToken: true
					,parameters: []
				}
				,'addRole': {
					endpoint: 'role'
					,method: 'POST'
					,addToken: true
					,parameters: []
				}
				,'deleteRole': {
					endpoint: 'role'
					,method: 'DELETE'
					,addToken: true
					,parameters: []
				}
				,'saveTeam': {
					endpoint: 'teams'
					,method: 'PUT'
					,addToken: true
					,parameters: []
				}
				,'addTeam': {
					endpoint: 'teams'
					,method: 'POST'
					,addToken: true
					,parameters: []
				}
				,'deleteTeam': {
					endpoint: 'teams'
					,method: 'DELETE'
					,addToken: true
					,parameters: []
				}
			}
		}
		,'authenticate': {
			endpoint: 'authenticate'
			,method: 'POST'
			,addToken: false
			,parameters: []
		}
		,'login': {
			endpoint: 'login'
			,method: 'POST'
			,addToken: false
			,parameters: []
		}
		,'logout': {
			endpoint: 'logout'
			,method: 'POST'
			,addToken: false
			,parameters: []
		}
		,'forgotPassword': {
			endpoint: 'forgotpassword'
			,method: 'POST'
			,addToken: false
			,parameters: ['hostname','emailaddress']
		}
		,'resetPassword': {
			endpoint: 'resetpassword'
			,method: 'POST'
			,addToken: false
		}
		,'validateSecretKey': {
			endpoint: 'validate_secretkey'
			,method: 'POST'
			,addToken: false
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
	TranslationService.load()
	.then(
		function(successResponse){
			console.log('Translation loaded');
		}
	);

	$rootScope.$on('$stateChangeStart',function(event, toState, toParams, fromState, fromParams, options){
		var currentUser = SessionService.getCurrentUser();
		$rootScope.fromStateName = fromState.name;
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
		console.error('$stateChangeError from ' + fromState.name + ' to ' + toState.name, ':', error);
	});

}) // END run
.config(['$stateProvider','$urlRouterProvider','AppConfig',function($stateProvider,$urlRouterProvider,AppConfig) {
	$urlRouterProvider
		.otherwise(function(){
			return '/login';
		}) // REDIRECT
		.when('/settings',function($state){
			$state.go(AppConfig.APPCONSTANTS_NAVIGATION_REDIRECT.SETTINGS);
		});

	$stateProvider
		.state('message', {
			url: '/message/'
			,params: {
				message: null
				,fromStateName: ''
			}
			,views: {
				'body': {
					controller: function ($scope, $stateParams, TranslationService) {
						$scope.message = TranslationService.getText($stateParams.message);
					}
					,templateUrl: '/app/shared/views/message.html'
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
					,controller: 'AuthenticationController'
				}
			}
		})
		/*
		 * ---------- userprofiles ----------
		 */
		.state('login.userProfiles', {
			url: '/userProfiles'
			,modal: true
			,templateUrl: '/app/components/login/views/userProfiles.html'
		})
		/*
		 * ---------- forgotpassword ----------
		 */
		.state('login.forgotPassword', {
			url: '/forgotPassword'
			,modal: true
			,templateUrl: '/app/components/login/views/forgotPassword.html'
		})
		/*
		 * ---------- resetpassword ----------
		 */ // called via url in mail
		.state('login.resetPassword', {
			url: '/resetPassword/:key'
			,templateUrl: '/app/components/login/views/resetPassword.html'
			,resolve: {
				validateResponse: function ($stateParams, AuthService) {
					return AuthService.validateSecretKey($stateParams.key);
				}
			}
			,onEnter: ['$stateProvider',function($stateProvider) {
				if (validateResponse.validate_ok == false) {
					$stateProvider.go('message', {message: (!validateResponse.message ? 'Token invalid' : validateResponse.message)});
				}
			}]
		})
		/*
		 * ---------- 2StepAuthentication ----------
		 */
		.state('login.2StepAuthentication', {
			url: '2StepAuthentication'
			,modal: true
			,templateUrl: '/app/components/login/views/2stepAuthentication.html'
		})
		/*
		 * ---------- register ----------
		 */
		.state('login.register', {
			url: '/register'
			,modal: true
			,templateUrl: '/app/components/register/views/register.html'
			,controller: '/app/components/register/controllers/RegisterController.js'
		})
		/*
		 * ========= LOGOUT =========
		 */
		.state('logout', {
			url: '/logout'
			,onEnter: ['AuthService',function(AuthService){
				AuthService.logout();
			}]
			,views: {
				'body@': {
					templateUrl: '/app/components/login/views/logout.html'
					,controller: 'AuthenticationController'
				}
			}
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
			}
		})
		/*
		 * ========= TRANSLATION =========
		 */
		.state('editTranslation', {
			url: '/editTranslation'
			,resolve: {
				data: ['TranslationService', function (TranslationService) {
					return TranslationService.load();
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
					return JoblistService.load();
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
					return {}; // later invullen
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
		})
		// ---------- SETTINGS.USERMANAGEMENT.uitgenodigd----------
		.state('settings.userManagement.uitgenodigd', {
			url:'/uitgenodigd'
		})
		// ---------- SETTINGS.USERMANAGEMENT.rollen----------
		.state('settings.userManagement.rechtenEnRollen', {
			url: '/rechtenEnRollen'
			,resolve: {
				roles: ['UserManagementService', function (UserManagementService) {
					return UserManagementService.roles();
				}]
				,permissions: ['UserManagementService', function (UserManagementService){
						return UserManagementService.permissions();
				}]
			}
			,views: {
				'tabContent@settings.userManagement': {
					controller: 'RightsAndRolesController'
					,templateUrl: '/app/components/settings/userManagement/rechtenEnRollen/views/listView.html'
				}
			}
		})
		// ---------- SETTINGS.USERMANAGEMENT.teams ----------
		.state('settings.userManagement.listTeams', {
			url: '/listTeams'
			,resolve: {
				data: ['UserManagementService', function(UserManagementService) {
					return UserManagementService.team();
				}]
			}
			,views: {
				'tabContent@settings.userManagement': {
					controller: 'TeamsController'
					,templateUrl: '/app/components/settings/userManagement/teams/views/listView.html'
				}
			}
		})
		.state('settings.userManagement.detailTeam', {
			url: '/detailTeams'
			,onEnter: ['$state','$stateParams',function($state,$stateParams){
				if($stateParams.teamId == undefined){
					$state.go('settings.userManagement.listTeams');
					event.preventDefault();
				}
			}]
			,params: {
				teamId: null
			}
			,resolve: {
				roles: ['UserManagementService', function (UserManagementService) {
					return UserManagementService.roles();
				}]
				,team: ['$stateParams','roles','UserManagementService', function($stateParams,roles,UserManagementService) {
					return UserManagementService.team($stateParams.teamId);
				}]
				,users: ['UserManagementService', function(UserManagementService) {
					return UserManagementService.user();
				}]
				,data: ['roles','team','users', function(roles,team,users) {
					return {'roles':roles,'team':team,users:users};
				}]
			}
			,views: {
				'tabContent@settings.userManagement': {
					controller: 'TeamsController'
					,templateUrl: '/app/components/settings/userManagement/teams/views/detailView.html'
				}
			}
		})
	// ---------- SETTINGS.USERMANAGEMENT.vacaturePool----------
		.state('settings.userManagement.vacaturePool', {
			url:'/vacaturePool'
		})
}]);