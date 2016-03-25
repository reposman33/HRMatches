angular.module('app.HRMatches',['angular-storage','ui.bootstrap','ui.router','xeditable'])
.constant('AppConfig',{
	APP_API_URL: 'http://api-development.hrmatches.com'
	,APP_HOSTNAME: '127.0.0.1' //location.hostname
	,APP_ISLOCAL: "127.0.0.1".indexOf(location.hostname) != -1
	,APP_NAVIGATION_ENTRYPOINT: 'vacaturegids'
	,APP_NAVIGATION_CURRENTDOMAIN: document.location.protocol + '://' + document.location.hostname
	,APP_SECURITY_SESSIONTIMEOUT: 20*60*1000
	// these states are accessible when not logged in
	,APP_PUBLICSTATES: "login,login.userProfiles,login.modal.forgotPassword,login.forgotPassword,login.resetPassword,message,register"
	,APP_TRANSLATIONS_DEFAULTISOLANGUAGE: 'nl_NL'
	,APP_TRANSLATIONS_DEFAULTTRANSLATIONKEY: ''
	,APP_PAGINATION_ITEMSPERPAGE: 25
	,APP_PAGINATION_NROFPAGEBUTTONS: 7
})
.run(function($rootScope,$state,AppConfig,AuthService,I18nService,SessionService,UtilsService){

	// perform any site-wide initialisation here
	$rootScope.$state = $state;
	$rootScope.I18nService = I18nService;
	$rootScope.AuthService = AuthService;
	$rootScope.UtilsService = UtilsService;

	//retrieve all languages
	I18nService.loadTranslations({
		language:AppConfig.APP_TRANSLATIONS_DEFAULTISOLANGUAGE,
		languageKey:AppConfig.APP_TRANSLATIONS_DEFAULTTRANSLATIONKEY
	})
	.then(
		function(I18nTexts){
			I18nService.loadData(I18nTexts);
		},function(errorResponse){
			console.log('I18nService.init() errorresponse: ', errorResponse);
		});

	
	$rootScope.$on('$stateChangeStart',function(event, toState, toParams, fromState, fromParams, options){
		var currentUser = SessionService.getCurrentUser();

		if(!currentUser){
			if(AppConfig.APP_PUBLICSTATES.indexOf(toState.name) == -1){
				// NO USER LOGGED IN, REDIRECT TO LOGIN
				console.warn('User not logged in, redirecting');
				$state.go('login');
				event.preventDefault();
			}
		}
		else if(AppConfig.APP_PUBLICSTATES.indexOf(toState.name) == -1){
			// USER LOGGED IN,CHECK SESSION TIMEOUT
			if(new Date().getTime() - currentUser.loginTime > AppConfig.APP_SECURITY_SESSIONTIMEOUT){
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
			$state.go(fromState.name);
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
				controller: function($scope,$stateParams,I18nService){
					$scope.message = I18nService.getText($stateParams.message);
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
	 * ========= PAAS: LANGUAGE ========= 
	 */
	.state('translations',{
		url: '/translations'
		,resolve: {
			languages: ['I18nService',function(I18nService){
				return I18nService.loadLanguages()
				.then(
					function(successResponse){
						return successResponse;
					}
					,function(errorResponse){
						console.warn('ERROR executing loadLanguages(): ',errorResponse);
					}
				);
			}]
			,translationCategories: ['I18nService',function(I18nService){
				return I18nService.loadTranslationCategories()
				.then(
					function(successResponse){
						return successResponse;
					}
					,function(errorResponse){
						console.warn('ERROR executing loadCategories():',errorResponse);
					}
				)
			}]
			,translations: ['I18nService','translationCategories',function(I18nService,translationCategories){
				return I18nService.loadTranslations({
					language:AppConfig.APP_TRANSLATIONS_DEFAULTISOLANGUAGE
					,languageKey:''
				})
				.then(
					function(successResponse){
						return successResponse;
					}
					,function(errorResponse){
						console.warn('ERROR executing loadLanguages(): ',errorResponse);
					}
				);
			}]
		}
		,views:{
			'body': {
				templateUrl: '/app/components/PaaS/translations/views/keysList.html'
				,controller: 'TranslationController'
			}
		}
	})
	.state('translations.editTranslation',{
		url: '/editTranslation'
		,params: {
			id:null
		}
		,resolve:{
			translation: ['I18nService',function(I18nService){
				return I18nService.loadTranslations({
					language:AppConfig.APP_TRANSLATIONS_DEFAULTISOLANGUAGE
					,languageKey:id
				})
				.then(
					function(successResponse){
						return successResponse;
					}
					,function(errorResponse){
						console.warn('ERROR executing loadLanguages(): ',errorResponse);
					}
				);
			}]
		}
		,views:{
			'editTranslation@translations':{
				templateUrl: '/app/components/PaaS/translations/views/keyDetail.html'
			}
		}
	})
	.state('default',{
		url: '/default'
		,templateUrl:'/app/shared/views/default.html'
	})
}])
