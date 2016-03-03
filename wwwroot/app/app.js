angular.module('app.HRMatches',['ui.router','angular-storage','ui.bootstrap'])
.constant('AppConfig',{
	// login authenticatie url
	APP_API_URL: 'http://api-development.hrmatches.com',
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
		controller:'AuthController',
		authenticate: true
	})
	.state('login',{
		url: '/login',
		views: {
			'body@':{
				templateUrl: '/app/components/login/views/login.html',
				controller:'AuthController',
				authenticate: false
			}
		},
	})
/*	.state('login.userprofiles',{
		url: '/userprofiles',
		onEnter: ['$modal',function($modal){
			$modal.open({
				templateUrl: '/app/components/login/views/userProfiles.html'
			})
		}]
	})
*/	.state('register',{
		url: '/register',
		templateUrl:'/app/components/register/views/register.html',
		controller:'RegisterController',
		authenticate: false
	})
	.state('vacaturegids',{
		url:'/vacaturegids',
		views: {
			'body@':{
				templateUrl:'/app/components/vacaturegids/views/vacaturegids.html',
				authenticate: true
			},
			'header@':{
				templateUrl:'/app/shared/components/navigation/views/navigation.html',
				authenticate: true,
				controller: 'NavigationController'
			}
			
		},
	})
	.state('default',{
		url: '/default',
		templateUrl:'/app/shared/views/default.html',
		authenticate: false
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
		if(toState.name!=='login' && !SessionService.isLoggedIn()){
console.log('AuthService.getCurrentUser() = ',SessionService.isLoggedIn(),', fromState = ',fromState.name,', toState = ',toState.name);
			$state.go('login');
			event.preventDefault();
		}
	});

		
	$rootScope.$on('$stateChangeSuccess',function(event, toState, toParams, fromState, fromParams, options){
		$rootScope.isLoggedIn = SessionService.isLoggedIn();
	});


})

