angular.module('app.HRMatches',['ui.router','angular-storage','ui.bootstrap'])
.constant('AppConfig',{
	APP_API_URL: 'http://api-development.hrmatches.com',
	APP_NAVIGATION_ENTRYPOINT: 'vacaturegids',
	APP_NAVIGATION_CURRENTDOMAIN: document.location.protocol + '://' + document.location.hostname
})
.run(function(I18nService,$rootScope,$state,AuthService,SessionService){

	// perform any site-wide initialisation here
	$rootScope.$state = $state;
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
		$state.go('login');
	});


	$rootScope.$on('$stateChangeStart',function(event, toState, toParams, fromState, fromParams, options){
		// REDIRECT TO LOGIN WHEN NOT LOGGED IN
		if(!SessionService.isLoggedIn() && fromState.name != "login" && toState.name != 'login.userprofiles'){
			$state.go('login');
			event.preventDefault();
		}
	});

		
	$rootScope.$on('$stateChangeSuccess',function(event, toState, toParams, fromState, fromParams, options){
		$rootScope.isLoggedIn = SessionService.isLoggedIn();
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
			'body@':{
				templateUrl: '/app/components/login/views/login.html',
				controller:'AuthController',
				authenticate: false
			}
		},
	})
	.state('login.userprofiles',{
		url: '/userprofiles',
		templateUrl: '/app/components/login/views/userProfiles.html',
		controller:function($scope,$stateParams){
			$scope.profiles = $stateParams.profiles;
		},
		params:{
			profiles:[]
		},
		onEnter: ['$modal',function($modal){
			$modal.open({
				templateUrl: '/app/components/login/views/userProfiles.html'
			})
		}]
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

