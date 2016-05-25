angular.module('app.ontdekJouwTalent')
.controller('CompanyController',['$scope','data',function($scope,data){

	$scope.data = data;


	
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