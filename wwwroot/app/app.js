angular.module('app.HRMatches',['angular-storage','ui.bootstrap','ui.router'])
.constant('AppConfig',{
	APP_API_URL: 'http://api-development.hrmatches.com',
	APP_NAVIGATION_ENTRYPOINT: 'vacaturegids',
	APP_NAVIGATION_CURRENTDOMAIN: document.location.protocol + '://' + document.location.hostname,
	APP_SECURITY_LOGINTIMEOUT: 10*1000 // millisecs	
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
			// er ging iets mis!!!
			console.log('I18nService.init() errorresonse: ', errorResponse);
		});


	$rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, options) {
		$state.go('login');
	});


	$rootScope.$on('$stateChangeStart',function(event, toState, toParams, fromState, fromParams, options){
		var currentUser = SessionService.getCurrentUser();

		// NO USER LOGGED IN, REDIRECT TO LOGIN
		if(!currentUser && toState.name !== 'login'  && toState.name !== 'login.userProfiles'){
			$state.go('login');
			event.preventDefault();
		}
		// USER LOGGED IN,CHECK SESSION TIMEOUT
		else if(currentUser && new Date().getTime() - currentUser.loginTime > AppConfig.APP_SECURITY_LOGINTIMEOUT){
			// LOGOUT WHEN SESSION EXPIRED
			AuthService.logout();
			$state.go('login');
			event.preventDefault();
		}
		else if(currentUser){
			// RESET TIMER
			SessionService.resetLoginTimeOut();
		}
	});


	$rootScope.$on('$stateChangeSuccess',function(event, toState, toParams, fromState, fromParams, options){
	});

})

.config(['$stateProvider','$urlRouterProvider',function($stateProvider,$urlRouterProvider){
	$urlRouterProvider
	.otherwise('/login');

	$stateProvider
	.state('home',{
		url: '/'
	})
	.state('login',{
		url: '/login',
		views: {
			'body':{
				templateUrl: '/app/components/login/views/login.html',
				controller:'AuthController',
				authenticate: false
			}
		},
	})
	.state('login.userProfiles',{
		url: '/userProfiles'
		,authenticate: false
		,views:{
			'userProfiles':{
				templateUrl: '/app/components/login/views/userProfiles.html'
				,controller: 'AuthController'
/*				,onEnter: function(){
					// DON'T DISPLAY EMPTY USERPROFILES WINDOW
					if(SessionService.get('userProfiles').length){
						$modal.open({
							templateUrl: '/app/components/login/views/userProfiles.html',
							animation:true
						})
					}
				}
*/			}
		}
	})
	.state('register',{
		url: '/register',
		templateUrl:'/app/components/register/views/register.html',
		controller:'RegisterController',
		authenticate: false
	})
	.state('vacaturegids',{
		url: '/vacaturegids',
		authenticate: true,
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
		templateUrl:'/app/shared/views/default.html',
		authenticate: false
	})

}])

