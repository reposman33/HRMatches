/**
 * @ngdoc controller
 * @name app.ontdekJouwTalent.controller:RegisterController
 * @description
 * This controller contains functionality for registering new users.
 * @requires  $scope,$location,AppConfig,APIService,TranslationService
 * Referring states: 'login.register'
 * */
angular.module('app.ontdekJouwTalent')
.controller('RegisterController',
	['$scope','$location','AppConfig','APIService','TranslationService',
	 function($scope,$location,AppConfig,APIService,TranslationService){
		$scope.emailInvalidClass = AppConfig.APPCONSTANTS_REGISTER_EMAILINVALID_FEEDBACK_CLASS;
		$scope.emailInvalidText = AppConfig.APPCONSTANTS_REGISTER_EMAILINVALID_FEEDBACK_TEXT;
		$scope.loginURL = $location.protocol() + '://' + $location.host() + ($location.port == 80 ? "" : (':' + $location.port())) + '/#/login';


		// REGISTERSUBMIT
		/**
		 * @ngdoc method
		 * @name registerSubmit
		 * @methodOf app.ontdekJouwTalent.controller:RegisterController
		 * @description
		 * Registers new users.<br/><br/>
		 * Dependencies: AppConfig,AuthService,APIService,TranslationService
		 *
		 */
		$scope.registerSubmit = function(){
			var error = false;
			$scope.infix = $scope.infix || "";
			$scope.registerFeedbackText = "";
			$scope.registerFeedbackClass = "";

			if(!($scope.firstname && $scope.lastname && $scope.email)){
				$scope.registerFeedbackClass = AppConfig.APPCONSTANTS_REGISTER_INCOMPLETEDATA_FEEDBACK_CLASS;
				$scope.registerFeedbackText = AppConfig.APPCONSTANTS_REGISTER_INCOMPLETEDATA_FEEDBACK_TEXT;
				error=true
			} else if($scope.password == undefined || ($scope.password !== $scope.confirm_password)){
				$scope.registerFeedbackClass = AppConfig.APPCONSTANTS_REGISTER_PASSWORDSNOMATCH_FEEDBACK_CLASS;
				$scope.registerFeedbackText = AppConfig.APPCONSTANTS_REGISTER_PASSWORDSNOMATCH_FEEDBACK_TEXT;
				error=true
			}
				// check password en confirm_pasword equality
			if(!error){
				// initialize requestdata parameters
				params = {
				   firstName: $scope.firstname,
				   infix: $scope.infix,
				   username: $scope.email,
				   password: $scope.password,
				   candidateOrigin: $location.host(),
				   emailaddress: $scope.email,
				   lastName: $scope.lastname,
				   personId: ""
				}
				for(var param in params){
					if(params.hasOwnProperty[param]){
						AppConfig.API_ENDPOINTS.registration.parameters[0].value[param] = params.param;
					}
				}
				APIService.register(AppConfig.API_ENDPOINTS.registration)
				.then(
					function(successResponse){
						$scope.error = successResponse.status != 200
						$scope.registerFeedbackText = TranslationService.getText(successResponse.data.message);
					},
					function(errorResponse){
						$scope.error = errorResponse.status != 200
						$scope.registerFeedbackText = TranslationService.getText(errorResponse.data.message);
					}
				);
			}
		}
	}
]);
