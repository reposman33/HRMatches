angular.module('app.HRMatches',['ui.router','angular-storage','ui.bootstrap'])
.constant('AppConfig',{
	// login authenticatie url
	APP_API_URL: 'http://api-development.hrmatches.com',
	// feedback tekst voor login
	APP_LOGIN_SUCCESS_FEEDBACK_TEXT: 'U bent succesvol ingelogd!',
	APP_LOGIN_NOTAUTH_FEEDBACK_TEXT: 'Authenticatie error:',
	APP_LOGIN_ERROR_FEEDBACK_TEXT: 'LOGIN ERROR:',
	APP_LOGIN_NOCREDENTIALS_FEEDBACK_TEXT: 'Email adres en wachtwoord invullen a.u.b.',
	// feedback classes voor login
	APP_LOGIN_SUCCESS_FEEDBACK_CLASS: 'col-md-8 alert alert-success',
	APP_LOGIN_NOTAUTH_FEEDBACK_CLASS: 'col-md-8 alert alert-danger',
	APP_LOGIN_ERROR_FEEDBACK_CLASS: 'col-md-8 alert alert-danger',
	APP_LOGIN_NOCREDENTIALS_FEEDBACK_CLASS: 'col-md-8 alert alert-warning',
	// registration
	APP_REGISTER_INCOMPLETEDATA_FEEDBACK_TEXT: 'Alle velden invullen a.u.b.',
	APP_REGISTER_PASSWORDSNOMATCH_FEEDBACK_TEXT: 'De ingevulde wachtwoorden zijn niet gelijk',
	APP_REGISTER_EMAILINVALID_FEEDBACK_TEXT: 'Ongeldig emailadres',
	APP_REGISTER_INCOMPLETEDATA_FEEDBACK_CLASS: 'col-md-12 alert alert-warning',
	APP_REGISTER_PASSWORDSNOMATCH_FEEDBACK_CLASS: 'col-md-12 alert alert-warning',
	APP_REGISTER_EMAILINVALID_FEEDBACK_CLASS: 'has-error',
	// overige instellingen
	APP_NAVIGATION_ENTRYPOINT: 'vacaturegids'
	
})
.config(['$stateProvider','$urlRouterProvider',function($stateProvider,$urlRouterProvider){
	$urlRouterProvider
	.otherwise('/login');

	$stateProvider
	.state('logout',{
		url: '/logout',
		templateUrl: '/app/components/login/views/logout.html',
		controller:'LoginController'
	})
	.state('login',{
		url: '/login',
		templateUrl: '/app/components/login/views/login.html',
		controller:'LoginController'
	})
	.state('login.userprofiles',{
		url: '/userprofiles',
		templateUrl: '/app/components/login/views/userProfiles.html',
		controller:'LoginController'
	})
	.state('register',{
		url: '/register',
		templateUrl:'/app/components/register/views/register.html',
		controller:'RegisterController'
	})
	.state('vacaturegids',{
		url:'/vacaturegids',
		templateUrl:'/app/components/vacaturegids/views/vacaturegids.html',
		authenticate: true
	})
	.state('default',{
		url: '/default',
		templateUrl:'/app/shared/views/default.html'
	})

}])
.run(function(I18nService,$rootScope,$state,AuthService,SessionService){

	$rootScope.AuthService = AuthService;
	
	I18nService.init()
	.then(
		function(I18nTexts){
			I18nService.loadData(I18nTexts);
		},function(errorResponse){
			// er ging iets mis!!!
			console.log('I18nService.init() errorresonse: ', errorResponse);
		});
	
		
	$rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, options) {
console.log('$stateChangeError: ',fromState,' toState= ',toState);
			$state.go('login');
		});
		
		
		$rootScope.$on('$stateChangeStart',function(event, toState, toParams, fromState, fromParams, options){
			// REDIRECT TO LOGIN WHEN NOT LOGGED IN
			if(toState.url==='/logout'){
				$rootScope.AuthService.logout();
			}
			
			if(toState.authenticate && !SessionService.getCurrentUser()){
console.log('AuthService.getCurrentUser() = ',SessionService.getCurrentUser(),', fromState = ',fromState.name,', toState = ',toState.name);
				$state.transitionTo('login');
				preventDefault();
			}
		});
		
		
		$rootScope.$on('stateChangeSuccess',function(event, toState, toParams, fromState, fromParams, options){
			$rootScope.isLoggedIn = SessionService.isLoggedIn();
		});


})

