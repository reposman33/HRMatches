angular.module('app.HRMatches',['angular-storage','ui.bootstrap','ui.router','xeditable'])
.constant('AppConfig',{
	APPCONSTANTS_API_URL: 'http://api-development.hrmatches.com'
	,APPCONSTANTS_HOSTNAME: '127.0.0.1' //location.hostname
	,APPCONSTANTS_ISLOCAL: "127.0.0.1".indexOf(location.hostname) != -1
	,APPCONSTANTS_NAVIGATION_ENTRYPOINT: 'translations'
	,APPCONSTANTS_NAVIGATION_CURRENTDOMAIN: document.location.protocol + '://' + document.location.hostname
	,APPCONSTANTS_FILELOCATIONS_VIEWS_NAVIGATIONBAR: "/app/components/navigation/views/navigation.html"
	,APPCONSTANTS_FILELOCATIONS_VIEWS_TABLEVIEW: "/app/shared/views/tableView.html"
	,APPCONSTANTS_SECURITY_SESSIONTIMEOUT: 20*60*1000

	// these states are accessible when not logged in
	,APPCONSTANTS_PUBLICSTATES: "login,login.userProfiles,login.modal.forgotPassword,login.forgotPassword,login.resetPassword,register"

	,API_ENDPOINTS: {
		'translations': {
			endpoint: '/translation'
			,method: 'POST'
			,parameters: [{
				name: 'language'
				,value: 'nl_NL'
			},{
				name:'languageKey'
				,value: ''
			}]
		}
		,'joblist': {
			endpoint: '/joblist'
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

	//retrieve all languages
	TranslationService.load(AppConfig.API_ENDPOINTS.translations);
	
	$rootScope.$on('$stateChangeStart',function(event, toState, toParams, fromState, fromParams, options){
		var currentUser = SessionService.getCurrentUser();

		if(!currentUser){
			if(AppConfig.APPCONSTANTS_PUBLICSTATES.indexOf(toState.name) == -1){
				// NO USER LOGGED IN, REDIRECT TO LOGIN
				console.warn('User not logged in, redirecting');
				$state.go('login');
				event.preventDefault();
			}
		}
		else if(AppConfig.APPCONSTANTS_PUBLICSTATES.indexOf(toState.name) == -1){
			// USER LOGGED IN,CHECK SESSION TIMEOUT
			if(new Date().getTime() - currentUser.loginTime > AppConfig.APPCONSTANTS_SECURITY_SESSIONTIMEOUT){
				// LOGOUT WHEN SESSION EXPIRED
				AuthService.logout();
				console.warn('Usersession timed out, redirecting');
				event.preventDefault();
				$state.go('login');
			}
			else{
				if(fromState.name == 'translations'){
					toParams.fromStateName = fromState.name;
					$state.go('message',{message:'U bent niet geauthoriseerd voor deze actie!'});
					event.preventDefault();
				}
				// RESET TIMER
				SessionService.resetLoginTimeOut();
			}
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
				$state.go('login');
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
	 * ========= LOGIN =========
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
		onEnter: function(APIService){
		    APIService.trackData('login');
	    }
    })
	.state('login.userProfiles',{
		url: '/userProfiles'
		,views:{
			'userProfiles':{
				templateUrl: '/app/components/login/views/userProfiles.html'
			}
		}
		,onEnter: function(APIService){
			APIService.trackData('login.userProfiles');
		}
	})
	.state('login.forgotPassword',{
		url: '/forgotPassword',
		views: {
			'forgotPassword':{
				templateUrl: '/app/components/login/views/forgotPassword.html'
			}
		}
		,onEnter: function(APIService){
			APIService.trackData('login.forgotPassword');
		}
	})
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
		,onEnter: function(APIService){
			APIService.trackData('login.resetPassword');
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
	.state('logout',{
		url:'/logout'
		,onEnter: function(AuthService){
			AuthService.logout();
		}
		,views:{
			'body':{
				templateUrl:'/app/components/login/views/logout.html'
				,controller: 'AuthController'
			}
		}
		,onEnter: function(APIService){
			APIService.trackData('logout');
		}
	})
	.state('login.2StepAuthentication',{
		url:'2StepAuthentication'
		,templateUrl:'/app/components/login/views/2stepAuthentication.html'
	})
	/*
	 * ========= REGISTER ========= 
	 */
	.state('register',{
		url: '/register'
		,views: {
			'body@': {
				templateUrl:'/app/components/register/views/register.html'
				,controller: 'RegisterController'
			}
		}
		,onEnter: function(APIService){
			APIService.trackData('register');
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
		,onEnter: function(APIService){
			APIService.trackData('vacaturegids');
		}
	})
	/*
	 * ========= TRANSLATIONS =========
	 */
	.state('translations',{
		url: '/translations'
		,resolve: {
			data: ['TranslationService',function(TranslationService){
				_data = TranslationService.load(AppConfig.API_ENDPOINTS.translations);
				return _data.data;
			}]
			,viewConfig: function(){
				return _data.configuration; //_data above is not local so we can reference it here...
			}
		}
		,views:{
			'body': {
				templateUrl: '/app/components/translations/views/translations.html'
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
		,onEnter: function(APIService){
			APIService.trackData('joblist');
		}
	})
	.state('default',{
		url: '/default'
		,templateUrl:'/app/shared/views/default.html'
	})
}])
