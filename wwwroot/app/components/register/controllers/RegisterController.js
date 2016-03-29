angular.module('app.HRMatches')
.controller('RegisterController',

	['$scope','$http','$location','AppConfig','TranslationService',function($scope,$http,$location,AppConfig,TranslationService){
		$scope.emailInvalidClass = AppConfig.APPCONSTANTS_REGISTER_EMAILINVALID_FEEDBACK_CLASS;
		$scope.emailInvalidText = AppConfig.APPCONSTANTS_REGISTER_EMAILINVALID_FEEDBACK_TEXT;
		$scope.loginURL = $location.protocol() + '://' + $location.host() + ($location.port == 80 ? "" : (':' + $location.port())) + '/#/login';

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
				$http({
					method: 'POST',
					url: AppConfig.APPCONSTANTS_API_URL + '/registration',
					data:{
					   firstName: $scope.firstname,
					   infix: $scope.infix,
					   username: $scope.email,
					   password: $scope.password,
					   candidateOrigin: $location.host(),
					   emailaddress: $scope.email,
					   lastName: $scope.lastname,
					   personId: ""
					}
				})
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
