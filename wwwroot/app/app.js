angular.module('app.HRMatches',['ui.router','angular-storage'])
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
	APP_REGISTER_INCOMPLETEDATA_FEEDBACK_TEXT: "Alle velden invullen a.u.b.",
	APP_REGISTER_PASSWORDSNOMATCH_FEEDBACK_TEXT: "De ingevulde wachtwoorden zijn niet gelijk",
	APP_REGISTER_EMAILINVALID_FEEDBACK_TEXT: "Ongeldig emailadres",
	APP_REGISTER_INCOMPLETEDATA_FEEDBACK_CLASS: "col-md-12 alert alert-warning",
	APP_REGISTER_PASSWORDSNOMATCH_FEEDBACK_CLASS: "col-md-12 alert alert-warning",
	APP_REGISTER_EMAILINVALID_FEEDBACK_CLASS: "has-error"
})
.config(['$stateProvider','$urlRouterProvider',function($stateProvider,$urlRouterProvider){
	$urlRouterProvider
	.otherwise('/login');

	$stateProvider
	.state('login',{
		url: '/login',
		templateUrl:'/app/components/login/views/login.html',
		controller:'LoginController'
	})
	.state('register',{
		url: '/register',
		templateUrl:'/app/components/register/views/register.html',
		controller:'RegisterController'
	})
	.state('vacaturegids',{
		url:'/vacaturegids',
		template:'',
		controller:'',
		resolve: {
			checkAuthenticated: ['$q','SessionService',function($q,SessionService){
				var currentUser = SessionService.getCurrentUser();
				if(currentUser){
					return $q.when(currentUser);
				}
				else{
					return $q.reject({authenticated: false});
				}
			}]
		}
	})
	.state('default',{
		url: '/default',
		templateUrl:'/app/shared/views/default.html'
	})

}])
.run(function(I18nService,$rootScope,$state){
	//Use this method to register work which should be performed when the injector is done loading all modules.
	I18nService.init()
	.then(
		function(I18nTexts){
			I18nService.loadData(I18nTexts);
		},function(errorResponse){
			// er ging iets mis!!!
			console.log('I18nService.init() errorresonse: ', errorResponse);
		});
	
		$rootScope.$on('$stateChangeError', function(event) {
		  $state.go('default');
		});
})

