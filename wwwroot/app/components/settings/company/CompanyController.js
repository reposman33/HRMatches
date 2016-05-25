angular.module('app.ontdekJouwTalent')
.controller('CompanyController',['$scope','$state','AppConfig','APIService','data',function($scope,$state,AppConfig,APIService,data){

	$scope.data = data;

	$scope.saveCompany = function(company){
		APIService.call({endpoint: AppConfig.API_ENDPOINTS.settings.companyInfo.endpoint,method:'PUT'},{companyinfo:company})
		.then(
			function(successResponse){
				$state.reload($state.current.name);
			}
		)
	}
	
	
	$scope.deleteCulture= function(id){
		APIService.call({endpoint: AppConfig.API_ENDPOINTS.settings.culture.endpoint,method:'DELETE'},{cultureId:id}
		.then(
				function(successResponse){
					$state.reload($state.current.name);
				}
			)
		)
	}

	$scope.saveCulture = function(culture){
		if('culture.id' !=''){
			APIService.call({endpoint: AppConfig.API_ENDPOINTS.settings.culture.endpoint,method:'POST'},{culture:culture}
				.then(
					function(successResponse){
						$state.reload($state.current.name);
						}
				)
			)
		}
		else{
			// save culture (POST)
		}
	}
}])