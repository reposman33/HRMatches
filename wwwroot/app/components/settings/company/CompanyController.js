angular.module('app.ontdekJouwTalent')
.controller('CompanyController',['$scope','AppConfig','APIService','data',function($scope,AppConfig,APIService,data){

	$scope.data = data;



	$scope.saveCompany = function(company){
		APIService.call({endpoint: AppConfig.API_ENDPOINTS.settings.companyInfo.endpoint,method:'PUT'},{companyinfo:company})
		.then(
			function(successResponse){
				console.log(successResponse);
			}
		)
	}
	
	
	$scope.deleteCulture= function(id){
		// delete culture
	}

	$scope.saveCulture = function(culture){
		if('culture.id' !=''){
			// edit culture (PUT)
		}
		else{
			// save culture (POST)
		}
	}
}])