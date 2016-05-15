angular.module('app.ontdekJouwTalent',['angular-storage','ui.bootstrap','ui.router','ui.router.modal','xeditable','angular-confirm'])
.constant('AppConfig',{
	// APPLICATION DEFINED VALUES
	APPCONSTANTS_HOSTNAME: location.hostname
	,APPCONSTANTS_ISLOCAL: "127.0.0.1,ontdekjouwtalent.local".indexOf(location.hostname) != -1
	,APPCONSTANTS_NAVIGATION_CURRENTDOMAIN: document.location.protocol + '://' + document.location.hostname
	,APPCONSTANTS_RESOURCES_URIS:{
		DOCUMENTATION: document.location.protocol + '//' + document.location.hostname + '/documentation'
	} //
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
		,SETTINGS:'settings.userManagement.rightsAndRoles'
	}

	// ENTITIES TEMPLATES - these templates are used for different entities (e.g. user, team) to define the default values for properties
	,APPCONSTANTS_SETTINGS_USERMANAGEMENT_ROLE: { // TEMPLATE FOR SETTINGS-USERMANAAGEMENT-RIGHTS_AND_ROLES: ADD NEW ROLE
		id: 0
		,systemName: 'New Role'
		,token:''
	}
	,APPCONSTANTS_SETTINGS_USERMANAGEMENT_TEAM: { // TEMPLATE FOR SETTINGS-USERMANAAGEMENT-TEAM: ADD NEW TEAM
		id: 0
		,displayName: 'New Team'
		,domainOwnerId: 0
		,members: []
		,token:''
	},
	APPCONSTANTS_SETTINGS_USERMANAGEMENT_JOBDOMAIN: {
		id: 0,
		companyCultureId: 0,
		displayName: 'New',
		domainOwnerId: 0,
		matchingId: 0,
		parent: 0,
		teams: [],
		token: ''
	}
	,APPCONSTANTS_SETTINGS_USERMANAGEMENT_USER: { // TEMPLATE FOR SETTINGS-USERMANAAGEMENT-USER: ADD NEW USER
		id: ''
		,emailaddress: ''
		,firstName: ''
		,infix: ''
		,lastName: ''
		,password: undefined // IMPORTANT FOR PASSWORD MATCH CHECK
		,passwordConfirm: undefined //IMPORTANT FOR PASSWORD MATCH CHECK
	}

	// API CONFIGURATION temporary struct to define endpoints, methods etc for API calls
	,API_ENDPOINTS: {
		'translation': {			// ===== LEGENDA =====
			endpoint: 'translation'	// endpoint to use for call to API
			,method: 'GET'			// http method to use
			,columnNames: {         // reference to columnames so we use different columnames in same shared view
				'displayName':'displayName'
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
		}
		,'joblist': {
			endpoint: 'jobs'
			,method: 'GET'
		}
		,'trackdata': {
			endpoint: 'trackdata'
			,method: 'POST'
			,parameters: {}
		},'registration': {
			endpoint: 'registration'
			,method: 'POST'
			,addToken: false
			,parameters: {
				data: { // custom format needed to inject dynamic values later in APIService
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
			endpoint: 'settings'
			,method: 'GET'
			,userManagement: {
				users: {
					endpoint: 'users'
					,method: 'GET'
				}
				,addUser: {
					endpoint: 'users'
					, method: 'POST'
				}
				,'deleteUser': {
					endpoint: 'users'
					,method: 'DELETE'
				}
				,'invited': {
					endpoint: 'userManagement-invited'
					,method: 'GET'
				}
				,'roles': {
					endpoint: 'role'
					,method: 'GET'
				}
				,'permissions': {
					endpoint: 'permission'
					,method: 'GET'
				}
				,'teams': {
					endpoint: 'teams'
					,method: 'GET'
					,columnNames: {
						'displayName':'displayName'
						,'id':'id'
					}
				}
				,'jobdomain': { //vacaturePool
					endpoint: 'jobdomains',
					method: 'GET',
					columnNames: {
						displayName: 'displayName',
						id: 'id',
						cultureName:'name',
						cultureNameId: 'id',
						matchingconfigurationName:'displayName',
						matchingconfigurationId: 'id'
					}
				}
				,'updateRolesAndPermissions': {
					endpoint: 'role'
					,method: 'PUT'
				}
				,'addRole': {
					endpoint: 'role'
					,method: 'POST'
				}
				,'deleteRole': {
					endpoint: 'role'
					,method: 'DELETE'
				}
				,'addTeam': {
					endpoint: 'teams'
					,method: 'POST'
				}
				,'deleteTeam': {
					endpoint: 'teams'
					,method: 'DELETE'
				}
				,'deleteTeamMember':{
					endpoint: 'teams'
					,method: 'DELETE'
				}
			}
		}
		,'authenticate': {
			endpoint: 'authenticate'
			,method: 'POST'
		}
		,'login': {
			endpoint: 'login'
			,method: 'POST'
		}
		,'logout': {
			endpoint: 'logout'
			,method: 'POST'
		}
		,'forgotPassword': {
			endpoint: 'forgotpassword'
			,method: 'POST'
		}
		,'resetPassword': {
			endpoint: 'resetpassword'
			,method: 'POST'
		}
		,'validateSecretKey': {
			endpoint: 'validate_secretkey'
			,method: 'POST'
		}
		,'cultures': {
			endpoint: 'cultures'
			,method: 'GET'
		}
		,'matchingconfigurations': {
			endpoint: 'matchingconfigurations'
			,method: 'GET'
		}
	}
}) //END constant
.run(function($rootScope,$state,APIService,AppConfig,AuthService,TranslationService,SessionService){
	// perform any site-wide initialisation here
	$rootScope.AppConfig = AppConfig; // use to access constants in views
	$rootScope.$state = $state; // use to go directly to state in view
	$rootScope.TranslationService = TranslationService; // used to display texts in view
	$rootScope.SessionService = SessionService; // used in index.html to display navigationbar when user is logged in.
	// RETRIEVE TRANSLATION
	TranslationService.load(AppConfig.API_ENDPOINTS.translation)
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

/*
*
* ONLY STATES THAT CORRESPOND TO APPLICATION VIEWS (ALSO REFERRED TO AS 'PAGES') ARE LISTED HERE. SINCE NO VIEW EXISTS FOR
* E.G. THE 'ADD' ACTION IN USERMANAGEMENT - RIGHTS AND ROLES LISTVIEW THERE IS NO CORRESPONDING STATE
*
* */
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
		})
		/*
		 * ========= LOGOUT =========
		 */
		.state('logout', {
			url: '/logout'
			,onEnter: ['APIService','SessionService',function(APIService,SessionService){
				APIService.call(AppConfig.API_ENDPOINTS.logout,{tokens:SessionService.getCurrentUserToken()})
				.finally(
					function(errorResponse){
						SessionService.removeCurrentUser();
					}
				)
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
				translation: ['TranslationService', function (TranslationService) {
					return TranslationService.load(AppConfig.API_ENDPOINTS.translation);
				}]
				,data: ['translation', function (translation) {
					return {
						listView:{
							data: translation.data,
							configuration: translation.configuration || {}
						}
					}
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
				menu: ['MenuService','UserManagementService', function (MenuService,UserManagementService) {
					return MenuService.getMenu('Settings');
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
				menu: ['menu','MenuService',
					function(menu,MenuService){
						return MenuService.retrieveSubMenuByParentUrl(menu,'/settings/userManagement');
					}
				]
			}
			,views: {
				'setting@settings': {
					templateUrl: '/app/components/settings/userManagement/views/userManagementContainer.html'
					,controller: 'UserManagementController'
				}
			}
		})
		// ---------- SETTINGS.USERMANAGEMENT.USERS----------
		.state('settings.userManagement.users', {
			url:'/users'
			,params: {
				domainName: undefined
			}
			,resolve: {
				data: ['$stateParams','APIService',function($stateParams,APIService){
					return APIService.call(AppConfig.API_ENDPOINTS.settings.userManagement.users,{domainName:$stateParams.domainName});
				}]
			}
			,views:{
				'tabContent@settings.userManagement': {
					controller: 'UsersController'
					,templateUrl: '/app/components/settings/userManagement/users/views/listView.html'
				}
			}
		})
		// ---------- SETTINGS.USERMANAGEMENT.addUser----------
		.state('settings.userManagement.addUser', {
			url:'/addUser'
			,resolve: {
				data: function(){
					// return the user template
					// SHOULD COME FROM API
					return angular.copy(AppConfig.APPCONSTANTS_SETTINGS_USERMANAGEMENT_USER);
				}
			}
			,views:{
				'tabContent@settings.userManagement': {
					controller: 'UsersController'
					,templateUrl: '/app/components/settings/userManagement/users/views/detailView.html'
				}
			}
		})
		// ---------- SETTINGS.USERMANAGEMENT.INVITED----------
		.state('settings.userManagement.invited', {
			url:'/invited'
		})
		// ---------- SETTINGS.USERMANAGEMENT.RECHTEN EN ROLLEN----------
		.state('settings.userManagement.rightsAndRoles', {
			url: '/rightsAndRoles'
			,resolve: {
				roles: ['APIService', function (APIService) {
					return APIService.call(AppConfig.API_ENDPOINTS.settings.userManagement.roles);
				}]
				,permissions: ['APIService', function (APIService){
					return APIService.call(AppConfig.API_ENDPOINTS.settings.userManagement.permissions);
				}]
				,data: ['roles','permissions', function(roles,permissions) {
					return {
						roles: roles,
						permissions: permissions
					}
				}]
			}
			,views: {
				'tabContent@settings.userManagement': {
					controller: 'RightsAndRolesController'
					,templateUrl: '/app/components/settings/userManagement/rechtenEnRollen/views/listView.html'
				}
			}
		})
		// ---------- SETTINGS.USERMANAGEMENT.TEAMS ----------
		// LIST
		.state('settings.userManagement.teams', {
			url: '/teams'
			,resolve: {
				teams: ['APIService', function(APIService) {
					return APIService.call(AppConfig.API_ENDPOINTS.settings.userManagement.teams);
				}]
				,data: ['teams', function(teams) {
					return {
						listView:{
							data: teams,
							configuration: teams.configuration || {}
						}
					}
				}]
			}
			,views: {
				'tabContent@settings.userManagement': {
					controller: 'TeamsController'
					,templateUrl: '/app/components/settings/userManagement/teams/views/listView.html'
				}
			}
		})
		// DETAIL
		.state('settings.userManagement.detailTeam', {
			url: '/detailTeam'
			,params: {
				id: undefined
			}
			,resolve: {
				roles: ['APIService', function (APIService) {
					return APIService.call(AppConfig.API_ENDPOINTS.settings.userManagement.roles);
				}]
				,team: ['$stateParams','APIService', function($stateParams,APIService) {
					if($stateParams.id){
						return APIService.call(AppConfig.API_ENDPOINTS.settings.userManagement.teams,{teamId:$stateParams.id})
					}
					else{
						return angular.copy(AppConfig.APPCONSTANTS_SETTINGS_USERMANAGEMENT_TEAM);
					}
				}]
				,users: ['APIService', function(APIService) {
					return APIService.call(AppConfig.API_ENDPOINTS.settings.userManagement.users);
				}]
				,data: ['roles','team','users', function(roles,team,users) {
					return {
						detailView: {
							roles: roles,
						 	team:  team,
							users: users
						},
						configuration: team.configuration || {}
					}
				}]
			}
			,views: {
				'tabContent@settings.userManagement': {
					controller: 'TeamsController'
					,templateUrl: '/app/components/settings/userManagement/teams/views/detailView.html'
				}
			}
		})
	// ---------- SETTINGS.USERMANAGEMENT.VACATUREPOOL (JOBDOMAINS) ----------
		.state('settings.userManagement.jobdomains', {
			url:'/jobDomains',
			resolve: {
				jobDomains: ['APIService', function(APIService) {
					return APIService.call(AppConfig.API_ENDPOINTS.settings.userManagement.jobdomain);
				}]
				,data: ['jobDomains', function(jobDomains) {
					return {
						listView:{
							data: jobDomains,
							configuration: jobDomains.configuration || {}
						}
					}
				}]
			}
			,views: {
				'tabContent@settings.userManagement': {
					controller: 'JobdomainsController'
					,templateUrl: '/app/components/settings/userManagement/jobdomains/views/listView.html'
				}
			}
		})
		// NEW JOBDOMAIN / EDIT JOBDOMAIN
		.state('settings.userManagement.jobdomain', {
			url: '/addJobdomain'
				,params: {
					id: undefined
				}
			,resolve: {
				jobdomain: ['$stateParams','AppConfig','APIService', function($stateParams,AppConfig,APIService) {
					return $stateParams.id != undefined
						? APIService.call(AppConfig.API_ENDPOINTS.settings.userManagement.jobdomain,{jobDomainId:$stateParams.id})
						: angular.copy(AppConfig.APPCONSTANTS_SETTINGS_USERMANAGEMENT_JOBDOMAIN);
				}]
				,cultures: ['APIService', function(APIService) {
					return APIService.call(AppConfig.API_ENDPOINTS.cultures);
				}]
				,matchingconfigurations: ['APIService', function(APIService) {
					return APIService.call(AppConfig.API_ENDPOINTS.matchingconfigurations);
				}]
				,jobDomains: ['APIService', function(APIService) {
					return APIService.call(AppConfig.API_ENDPOINTS.settings.userManagement.jobdomain);
				}]
				,teams: ['APIService', function(APIService) {
					return APIService.call(AppConfig.API_ENDPOINTS.settings.userManagement.teams);
				}]
				,data: ['jobdomain','cultures','matchingconfigurations','jobDomains','teams',
						function(jobdomain,cultures,matchingconfigurations,jobDomains,teams) {
							return {
								detailView:{
									jobDomains:jobDomains,
									jobDomain: jobdomain,
									cultures:cultures,
									matchingconfigurations:matchingconfigurations,
									teams:teams
								}
							};
						}
					]
			}
			,views: {
				'tabContent@settings.userManagement': {
					controller: 'JobdomainsController'
					,templateUrl: '/app/components/settings/userManagement/jobdomains/views/detailView.html'
				}
			}
		}
	)
}]);