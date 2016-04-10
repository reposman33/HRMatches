angular.module('app.HRMatches',['angular-storage','ui.bootstrap','ui.router','xeditable'])
.constant('AppConfig',{
	// APPLICATION SPECIFIC CONSTANT VALUES
	APPCONSTANTS_HOSTNAME: location.hostname
	,APPCONSTANTS_ISLOCAL: "127.0.0.1".indexOf(location.hostname) != -1
	,APPCONSTANTS_NAVIGATION_CURRENTDOMAIN: document.location.protocol + '://' + document.location.hostname
	,APPCONSTANTS_FILELOCATIONS_VIEWS: {
		NAVIGATIONBAR: '/app/components/navigation/views/navigation.html'
		,TABLEVIEW: '/app/shared/views/tableView.html'
		,SETTINGS: {
			CONTAINER: '/app/components/settings/views/container.html'
			,USERMANAGEMENT: {
				USERSANDROLES: '/app/components/settings/gebruikersbeheer/rechtenEnRollen/views/rechtenEnRollen.html'
			}
		}
	}
	/* ,APPCONSTANTS_SECURITY_SESSIONTIMEOUT: 20*60*1000 // deprecated: wordt alleen server side gebruikt */

	// BACK END CONFIGURABLE CONSTANTS
	,APPCONSTANTS_PAGINATION_MAXSIZE: 25
	,APPCONSTANTS_API_URL: 'http://api-development.hrmatches.com'
	,APPCONSTANTS_PUBLICSTATES: "login,login.forgotPassword,login.userProfiles,login.resetPassword,login.register" // exclusively public states
	,APPCONSTANTS_NAVIGATION_ENTRYPOINT: 'editTranslation'
	,APPCONSTANTS_NAVIGATION_REDIRECT: {
		NOTAUTHENTICATED:'login'
		,NOTAUTHORIZED:''
	}
	,APPCONSTANTS_TEXTS: {
		INVALIDTOKEN: 'Invalid token'
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
				name: 'clientvariables'
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
					,'colorDepth': screen.colorDepth //kleuren in bits/pixels
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
		,'rechtenenrollen': {
			endpoint: 'rechtenenrollen'
			,method: 'GET'
			,addToken: 'true'
			,parameters: []
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
			console.log('TranslationService.loaded: ',successResponse);
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
			event.preventDefault();
		}
	});


	$rootScope.$on('$stateChangeSuccess',function(event, toState, toParams, fromState, fromParams, options){
		APIService.trackData(toState.name);

	});

	$rootScope.$on('$stateChangeError',function(event, toState, toParams, fromState, fromParams, error){
		switch(error.status){
			case 500:{ // eerver error
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
		console.error('ERROR $stateChangeError: ',error);
	});

}) // END run
.config(['$stateProvider','$urlRouterProvider','AppConfig',function($stateProvider,$urlRouterProvider,AppConfig){
	$urlRouterProvider
	.otherwise('/login');

	$stateProvider
	.state('home',{
		views:{
			'header': {
				templateUrl: AppConfig.APPCONSTANTS_FILELOCATIONS_VIEWS_NAVIGATIONBAR,
				controller: 'AuthController'
			}
		}
		,abstract: true
	})
	.state('message',{
		url: '/message/',
		params:{
			message: null
			,fromStateName: ''
		},
		views:{
			'body': {
				controller: function($scope,$stateParams,TranslationService){
					$scope.message = TranslationService.getText($stateParams.message);
					$scope.fromStateName = $stateParams.fromStateName;
				},
				templateUrl: '/app/shared/views/message.html'
			}
		}
	})
	.state('modal-backdrop',{
		views: {
			'modal':{
				templateUrl: '/app/shared/views/modal-backdrop.html'
			}
		}
	})
	/*
	 * ========== LOGIN ==========
	 */
    .state('login',{
        url: '/login',
        views: {
            'header':{
                templateProvider: function($templateFactory,AuthService){
                    if(AuthService.isLoggedIn()){
                        return $templateFactory.fromUrl(AppConfig.APPCONSTANTS_FILELOCATIONS_VIEWS_NAVIGATIONBAR)
                    }
                }
            },
            'body':{
                templateUrl: '/app/components/login/views/login.html'
                ,controller: 'AuthController'
            }
        }
    })
	/*
	 *    ========== USERPROFILES ==========
	 */
	.state('login.userProfiles',{
		url: '/userProfiles'
		,views:{
			'userProfiles':{
				templateUrl: '/app/components/login/views/userProfiles.html'
			}
		}
	})
	/*
	 * ========= FORGOTPASSWORD =========
	 */
	.state('login.forgotPassword',{
		url: '/forgotPassword',
		views: {
			'forgotPassword':{
				templateUrl: '/app/components/login/views/forgotPassword.html'
			}
		}
	})
	/*
	 * ========= RESETPASSWORD =========
	 */
	.state('login.resetPassword',{
		url: '/resetPassword/:key'
		,resolve: {
			validateResponse:
				function($stateParams,AuthService){
					return AuthService.validateSecretKey($stateParams.key);
			}
		}
		,onEnter: function($rootScope,APIService){
			if(validateResponse.validate_ok == false){
				$stateProvider.go('message',{message: (!validateResponse.message ? 'Token invalid' : validateResponse.message)});
			}
		}
		,views: {
			'forgotPassword': {
				templateUrl: '/app/components/login/views/resetPassword.html'
				,controller: 'AuthController'
			}
		}
	})
	/*
	 * ========= LOGOUT =========
	 */
	.state('logout',{
		url:'/logout'
		,views:{
			'body':{
				templateUrl:'/app/components/login/views/logout.html'
				,controller: 'AuthController'
			}
		}
	})
	.state('login.2StepAuthentication',{
		url:'2StepAuthentication'
		,templateUrl:'/app/components/login/views/2stepAuthentication.html'
	})
	/*
	 * ========= REGISTER ========= 
	 */
	.state('login.register',{
		url: '/register'
		,views: {
			'register': {
				templateUrl:'/app/components/register/views/register.html'
				,controller: 'RegisterController'
			}
		}
	})
	/*
	 * ========= VACATUREGIDS ========= 
	 */
	.state('vacaturegids',{
		url: '/vacaturegids'
		,views: {
			'body@':{
				templateUrl: '/app/components/vacaturegids/views/vacaturegids.html'
			}
			,'header': {
				templateUrl: AppConfig.APPCONSTANTS_FILELOCATIONS_VIEWS_NAVIGATIONBAR
				,controller: 'AuthController'
			}
		}
	})
	/*
	 * ========= TRANSLATION =========
	 */
	.state('editTranslation',{
		url: '/editTranslation'
		,resolve: {
			data: ['TranslationService',function(TranslationService){
				return TranslationService.load(AppConfig.API_ENDPOINTS.translation);
			}]
		}
		,views:{
			'body': {
				templateUrl: '/app/components/translation/views/editTranslation.html'
				,controller: 'TranslationController'
			}
		}
	})
	/*
	* ========= JOBLIST =========
	*/
	.state('joblist',{
		url: '/joblist'
		,resolve: {
			data: ['JoblistService',function(JoblistService){
				return JoblistService.load(AppConfig.API_ENDPOINTS.joblist);
			}]
		}
		,views:{
			'body': {
				templateUrl: '/app/components/joblist/views/jobs.html'
				,controller: 'JoblistController'
			}
		}
	})
	/*
	 * ========= SETTINGS =========
	 */
	.state('settings',{
		url: '/settings'
		,resolve: {
		}
		,views:{
			'body@': {
				templateUrl: AppConfig.APPCONSTANTS_FILELOCATIONS_VIEWS.SETTINGS.CONTAINER
				,controller: 'RechtenEnRollenController'
			}
		}
	})
}])
