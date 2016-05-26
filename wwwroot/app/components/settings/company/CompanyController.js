angular.module('app.ontdekJouwTalent')
.controller('CompanyController',['$scope','$state','AppConfig','APIService','data','SessionService',function($scope,$state,AppConfig,APIService,data,SessionService){

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
		APIService.call({endpoint: AppConfig.API_ENDPOINTS.settings.cultures.endpoint,method:'DELETE'},{id:id})
		.then(
			function(successResponse){
				$state.reload($state.current.name);
			}
		)
	}

	$scope.saveCulture = function(culture){
		var method = 'PUT'
		if(culture.id == undefined || culture.id == null || culture.id ==''){
			method = 'POST';
		}
		APIService.call({endpoint: AppConfig.API_ENDPOINTS.settings.cultures.endpoint,method:method},{culture:culture})
		.then(
			function(successResponse){
				$state.go('settings.company.culture',null,{reload:true});
			}
		)
	}
}])