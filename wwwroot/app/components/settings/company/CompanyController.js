angular.module('app.ontdekJouwTalent')
.controller('CompanyController',['$scope',function($scope){

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