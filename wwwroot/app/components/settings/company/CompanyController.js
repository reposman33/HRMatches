angular.module('app.ontdekJouwTalent')
.controller('CompanyController',['$scope','$state','AppConfig','APIService','data','growl','SessionService',
function($scope,$state,AppConfig,APIService,data,growl,SessionService){

	$scope.data = data;

	$scope.saveCompany = function(company){
		APIService.call({endpoint: AppConfig.API_ENDPOINTS.settings.companyInfo.endpoint,method:'PUT'},{companyinfo:company})
		.then(
			function(successResponse){
				growl.success('De bedrijfsinfo is gewijzigd!!',{title:'Success!'});
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
		var method = (culture.id == undefined || culture.id == null || culture.id =='') ? 'POST' : 'PUT';
		APIService.call({endpoint: AppConfig.API_ENDPOINTS.settings.cultures.endpoint,method:method},{culture:culture})
		.then(
			function(){
				return growl.success('De cultuur is gewijzigd!!',{title:'Success!'});
			}
		)
		.then(
			function(successResponse){
				return $state.go('settings.company.culture',null,{reload:true});
			}
		)
	}
}])