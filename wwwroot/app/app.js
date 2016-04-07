angular.module('app.HRMatches',['angular-storage','ui.bootstrap','ui.router','xeditable'])
.constant('AppConfig',{
	// APPLICATION SPECIFIC CONSTANT VALUES
	APPCONSTANTS_HOSTNAME: location.hostname
	,APPCONSTANTS_ISLOCAL: "127.0.0.1".indexOf(location.hostname) != -1
	,APPCONSTANTS_NAVIGATION_CURRENTDOMAIN: document.location.protocol + '://' + document.location.hostname
	,APPCONSTANTS_FILELOCATIONS_VIEWS_NAVIGATIONBAR: "/app/components/navigation/views/navigation.html"
	,APPCONSTANTS_FILELOCATIONS_VIEWS_TABLEVIEW: "/app/shared/views/tableView.html"
	/* ,APPCONSTANTS_SECURITY_SESSIONTIMEOUT: 20*60*1000 // deprecated: wordt alleen server side gebruikt */

	// BACK END CONFIGURABLE CONSTANTS
	,APPCONSTANTS_API_URL: 'http://api-development.hrmatches.com'
	,APPCONSTANTS_NAVIGATION_ENTRYPOINT: 'editTranslation'
	,APPCONSTANTS_PUBLICSTATES: "login,login.forgotPassword,login.userProfiles,login.resetPassword,register" // exclusively public states
	,APPCONSTANTS_NAVIGATION_REDIRECT: {
		NOTAUTHENTICATED:'login'
		,NOTAUTHORIZED:''
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
			,parameters: []
		}
		,'trackdata': {
			endpoint: 'trackdata'
			,method: 'POST'
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
	}
})
.run(function($rootScope,$state,AppConfig,AuthService,TranslationService,SessionService){
	// perform any site-wide initialisation here
	$rootScope.AppConfig = AppConfig;
	$rootScope.$state = $state;
	$rootScope.TranslationService = TranslationService;
	$rootScope.SessionService = SessionService;

	// RETRIEVE TRANSLATION
	if(SessionService.getCurrentUserToken() === ''){
		// if not loggedin do request, else retrieve cached data in TranslationService
		TranslationService.load(AppConfig.API_ENDPOINTS.translation);
	}

	$rootScope.$on('$stateChangeStart',function(event, toState, toParams, fromState, fromParams, options){
		$rootScope.toState = toState; // store current state name for logging
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

})

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
		},
		abstract: true
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
		},
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
                },
            },
            'body':{
                templateUrl: '/app/components/login/views/login.html'
                ,controller: 'AuthController'
            }
        },
		onEnter: function($rootScope,APIService){
		    APIService.trackData($rootScope.toState.name);
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
		,onEnter: function($rootScope,APIService){
			APIService.trackData($rootScope.toState.name);
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
		,onEnter: function($rootScope,APIService){
			APIService.trackData($rootScope.toState.name);
		}
	})
	/*
	 * ========= RESETPASSWORD =========
	 */
	.state('login.resetPassword',{
		url: '/resetPassword/:key'
		,resolve: {
			validateResponse:
				function($stateParams,AuthService,SessionService){
					return AuthService.validateSecretKey($stateParams.key)
					.then(function(successResponse){
						SessionService.set('secretKey',$stateParams.key);
						return {validate_ok:successResponse.data.message}
					}
					,function(errorResponse){
						SessionService.set('secretKey',$stateParams.key);
						return {validate_ok:errorResponse.data.message}
					})
			}
		}
		,onEnter: function($rootScope,APIService){
			APIService.trackData($rootScope.toState.name);
			if(validateResponse.validate_ok){
				// do nothing, go to resetPassword
			}
			else{
				$stateProvider.go('message',{message:validateResponse.validate_ok});
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
		,onEnter: function($rootScope,APIService){
			APIService.trackData($rootScope.toState.name);
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
		,onEnter: function($rootScope,APIService){
			APIService.trackData($rootScope.toState.name);
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
		,onEnter: function($rootScope,APIService){
			APIService.trackData($rootScope.toState.name);
		}
	})
	/*
	 * ========= TRANSLATION =========
	 */
	.state('editTranslation',{
		url: '/editTranslation'
		,resolve: {
			data: ['TranslationService',function(TranslationService){
				_data = TranslationService.load(AppConfig.API_ENDPOINTS.translation);
				return _data.data;
			}]
			,viewConfig: function(){
				return _data.configuration; //_data above is not local so we can reference it here...
			}
		}
		,views:{
			'body': {
				templateUrl: '/app/components/translation/views/editTranslation.html'
				,controller: 'TranslationController'
			}
		}
		,onEnter: function($rootScope,APIService){
			APIService.trackData($rootScope.toState.name);
		}
	})
	/*
	* ========= JOBLIST =========
	*/
	.state('joblist',{
		url: '/joblist'
		,resolve: {
			APIResponse: ['JoblistService',function(JoblistService){
				return JoblistService.load(AppConfig.API_ENDPOINTS.joblist);
			}]
		}
		,views:{
			'body': {
				templateUrl: '/app/components/joblist/views/jobs.html'
				,controller: 'JoblistController'
			}
		}
		,onEnter: function($rootScope,APIService){
			APIService.trackData($rootScope.toState.name);
		}
	})
}])
