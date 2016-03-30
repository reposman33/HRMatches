angular.module('app.HRMatches',['angular-storage','ui.bootstrap','ui.router','xeditable'])
.constant('AppConfig',{
	APPCONSTANTS_API_URL: 'http://api-development.hrmatches.com'
	,APPCONSTANTS_HOSTNAME: '127.0.0.1' //location.hostname
	,APPCONSTANTS_ISLOCAL: "127.0.0.1".indexOf(location.hostname) != -1
	,APPCONSTANTS_NAVIGATION_ENTRYPOINT: 'translations'
	,APPCONSTANTS_NAVIGATION_CURRENTDOMAIN: document.location.protocol + '://' + document.location.hostname
	,APPCONSTANTS_SECURITY_SESSIONTIMEOUT: 20*60*1000
	// these states are accessible when not logged in
	,APPCONSTANTS_PUBLICSTATES: "login,login.userProfiles,login.modal.forgotPassword,login.forgotPassword,login.resetPassword,register"

	,VIEWS: {
		translations:{
			listView:{
				row_editable: true
				,columns:[{
					columnName: 'id'
					,visible:true
					,header_visible:true
					,header_text:'Key'
					,cell_editable: false
				},{
					columnName: 'DisplayName'
  					,visible:true
					,header_visible:true
					,header_text:'Vertaling'
					,cell_editable: true
				}]
				,pagination: {
					enable:true
					,maxSize: 10
					,itemsPerPage:15
				}
			}
		}
	}
	,API_ENDPOINTS: {
		'translations': {
			api_url: 'http://api-development.hrmatches.com' + '/translation'
			,api_method: 'POST'
			,api_params: [{
				key: 'language'
				,value: 'nl_NL'
			},{
				key:'languageKey'
				,value: ''
			}]
		}
	}
})
.run(function($rootScope,$state,AppConfig,AuthService,TranslationService,SessionService,UtilsService){
	// perform any site-wide initialisation here
	$rootScope.$state = $state;
	$rootScope.TranslationService = TranslationService;
	$rootScope.SessionService = SessionService;
	$rootScope.UtilsService = UtilsService;

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
				$state.go('login');
				event.preventDefault();
			}
			else{
				
				// RESET TIMER
				SessionService.resetLoginTimeOut();
			}
		}
		else{
			$state.go(toState.name);
			event.preventDefault();
		}
	});


	$rootScope.$on('$stateChangeSuccess',function(event, toState, toParams, fromState, fromParams, options){
	});

	$rootScope.$on('$stateChangeError',function(event, toState, toParams, fromState, fromParams, error){
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
				templateUrl: '/app/shared/components/navigation/views/navigation.html',
				controller: 'AuthController'
			}
		},
		abstract: true
	})
	.state('message',{
		url: '/message/',
		params:{
			message: null
		},
		views:{
			'body': {
				controller: function($scope,$stateParams,TranslationService){
					$scope.message = TranslationService.getText($stateParams.message);
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
                        return $templateFactory.fromUrl('/app/shared/components/navigation/views/navigation.html')
                    }
                },
            },
            'body':{
                templateUrl: '/app/components/login/views/login.html'
                ,controller: 'AuthController'
            }
        },
    })
	.state('login.userProfiles',{
		url: '/userProfiles'
		,views:{
			'userProfiles':{
				templateUrl: '/app/components/login/views/userProfiles.html'
			}
		}
	})
	.state('login.forgotPassword',{
		url: '/forgotPassword',
		views: {
			'forgotPassword':{
				templateUrl: '/app/components/login/views/forgotPassword.html'
			}
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
		,onEnter: function($stateParams,$state,validateResponse){
			if(validateResponse.validate_ok){
				// do nothing, go to resetPassword
			}
			else{
				$state.go('message',{message:validateResponse.validate_ok});
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
	})
	/*
	 * ========= LOGIN - 2STEPAUTHENTICATION =========
	 */
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
				templateUrl: '/app/shared/components/navigation/views/navigation.html'
				,controller: 'AuthController'
			}
		}
	})
	/*
	 * ========= PAAS: TRANSLATIONS ========= 
	 */
	.state('translations',{
		url: '/translations'
		,views:{
			'body': {
				templateUrl: '/app/components/PaaS/translations/views/keysList.html'
				,controller: 'TranslationController'
			}
		}
	})
	.state('default',{
		url: '/default'
		,templateUrl:'/app/shared/views/default.html'
	})
}])
