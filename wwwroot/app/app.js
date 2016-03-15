angular.module('app.HRMatches',['angular-storage','ui.bootstrap','ui.router','ngMessages'])
.constant('AppConfig',{
	APP_API_URL: 'http://api-development.hrmatches.com',
	APP_HOSTNAME: location.hostname,
	APP_NAVIGATION_ENTRYPOINT: 'vacaturegids',
	APP_NAVIGATION_CURRENTDOMAIN: document.location.protocol + '://' + document.location.hostname,
	APP_SECURITY_SESSIONTIMEOUT: 20*60*1000,
	APP_PUBLICSTATES: "login,login.userProfiles,login.modal.forgotPassword,login.resetPassword"
})
.run(function($rootScope,$state,AppConfig,AuthService,I18nService,SessionService){

	// perform any site-wide initialisation here
	$rootScope.$state = $state;
	$rootScope.I18nService = I18nService;
	
	I18nService.init()
	.then(
		function(I18nTexts){
			I18nService.loadData(I18nTexts);
		},function(errorResponse){
			console.log('I18nService.init() errorresonse: ', errorResponse);
		});


	$rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, options) {
		$state.go('login');
	});


	$rootScope.$on('$stateChangeStart',function(event, toState, toParams, fromState, fromParams, options){
		var currentUser = SessionService.getCurrentUser();

		if(!currentUser){
			if(AppConfig.APP_PUBLICSTATES.indexOf(toState.name) == -1){
				// NO USER LOGGED IN, REDIRECT TO LOGIN
				$state.go('login');
				event.preventDefault();
			}
		}
		else{
			// USER LOGGED IN,CHECK SESSION TIMEOUT
			if(new Date().getTime() - currentUser.loginTime > AppConfig.APP_SECURITY_SESSIONTIMEOUT){
				// LOGOUT WHEN SESSION EXPIRED
				AuthService.logout();
				$state.go('login');
				event.preventDefault();
			}
			else{
				// RESET TIMER
				SessionService.resetLoginTimeOut();
			}
		}
	});


	$rootScope.$on('$stateChangeSuccess',function(event, toState, toParams, fromState, fromParams, options){
	});

})
// STATES DEFINITIONS
.config(['$stateProvider','$urlRouterProvider',function($stateProvider,$urlRouterProvider){
	$urlRouterProvider
	.otherwise('/login');

	$stateProvider
	.state('message',{
		url: '/message',
		templateUrl: '/app/shared/views/message.html'
	})
	.state('modal-backdrop',{
		views: {
			'modal':{
				templateUrl: '/app/shared/views/modal-backdrop.html',
			}
		},
	})
	.state('login',{
		url: '/login',
		views: {
			'body':{
				templateUrl: '/app/components/login/views/login.html',
				controller:'AuthController'
			}
		},
	})
	.state('login.userProfiles',{
		url: '/userProfiles'
		,views:{
			'userProfiles':{
				templateUrl: '/app/components/login/views/userProfiles.html'
				,controller: 'AuthController'
			}
		}
	})
	.state('login.2StepAuthentication',{
		url:'2StepAuthentication',
		templateUrl:'/app/components/login/views/2stepAuthentication.html'
	})
	.state('login.register',{
		url: '/register',
		templateUrl:'/app/components/register/views/register.html',
		controller:'RegisterController'
	})
	.state('login.forgotPassword',{
		url: '/forgotPassword',
		views: {
			'forgotPassword':{
				templateUrl: '/app/components/login/views/forgotPassword.html',
				controller:'AuthController'
			}
		}
	})
	.state('login.resetPassword',{
		url: '/resetPassword/{validateToken}',
		views:{
			'resetPassword': {
				templateUrl: '/app/components/login/views/resetPassword.html',
				onEnter: function(){
					AuthService.validatePasswordResetToken($stateParams.validatetoken)
					.then(function(validateResponse){
						if(!validateResponse.data.VALIDATE_OK){
							$state.go('message',{message:validateResponse.data.message})
						}
					})
				}
			}
		}
	}
	.state('vacaturegids',{
		url: '/vacaturegids',
		views: {
			'body@':{
				templateUrl: '/app/components/vacaturegids/views/vacaturegids.html'
			},
			'header@':{
				templateUrl: '/app/shared/components/navigation/views/navigation.html',
				controller: 'AuthController'
			}
		}
	})
	.state('default',{
		url: '/default',
		templateUrl:'/app/shared/views/default.html'
	})
}])

