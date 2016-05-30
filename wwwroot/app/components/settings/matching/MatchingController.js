/**
 * @ngdoc controller
 * @name app.ontdekJouwTalent.controller:MatchingController
 * @description This controller contains functionality for Matching Configurations under 'Settings'
 * @requires $scope,
 * Referring states:'settings.matching'
 * */
angular.module('app.ontdekJouwTalent')
.controller('MatchingController',['$scope','$state','AppConfig','APIService','data','SessionService',function($scope,$state,AppConfig,APIService,data,SessionService){
	$scope.data = data;

	$scope.delete = function(id){
		APIService.call({endpoint:AppConfig.API_ENDPOINTS.matchingconfigurations.endpoint,method:'DELETE'},{matchingId:id})
		.then(
			function(successResponse){
				$state.reload($state.current.name);
			}
		)
	}

	$scope.save = function(matchingConfiguration){
		var method = (matchingConfiguration.id != undefined && matchingConfiguration.id.length > 0)
			? 'PUT'
			: 'POST';
		APIService.call({endpoint:AppConfig.API_ENDPOINTS.matchingconfigurations.endpoint,method:method},{matchingConfiguration:matchingConfiguration})
		.then(
			function(successResponse){
				$state.go('^',null,{reload:true});
			}
		)
	}

	$scope.applySet = function(id){
		$scope.$evalAsync(
			function(){
				APIService.call(AppConfig.API_ENDPOINTS.matchingconfigurations,{matchingId:id})
				.then(
					function(successResponse){
					/* populate scope variables with retrieved data */
					$scope.educationPassed = successResponse.educationPassed;
					$scope.experienceLevelBelowZero = successResponse.experienceLevelBelowZero;
					$scope.educationLevelExponent = successResponse.educationLevelExponent;
					$scope.experienceSubAreaWeight = successResponse.experienceSubAreaWeight;
					$scope.experienceWeight = successResponse.experienceWeight;
					$scope.languageWeight = successResponse.languageWeight;
					$scope.traitsExponent = successResponse.traitsExponent;
					$scope.educationWeight = successResponse.educationWeight;

					$scope.deleted = successResponse.deleted;
					$scope.skillWeight = successResponse.skillWeight;
					$scope.experienceLevelWeight = successResponse.experienceLevelWeight;
					$scope.languageExponent = successResponse.languageExponent;

					$scope.educationAreaWeight = successResponse.educationAreaWeight;
					$scope.competenceExponent = successResponse.competenceExponent;
					$scope.experienceAreaWeight = successResponse.experienceAreaWeight;
					$scope.created = successResponse.created;
					$scope.experienceLevelAboveZero = successResponse.experienceLevelAboveZero;

					$scope.competenceWeight = successResponse.competenceWeight;
					$scope.skillExponent = successResponse.skillExponent;
					$scope.educationNotPassed = successResponse.educationNotPassed;
					$scope.updated = successResponse.updated;
					$scope.generalSkillWeight = successResponse.generalSkillWeight;
					$scope.knowledgeWeight = successResponse.knowledgeWeight;
					$scope.personalityWeight = successResponse.personalityWeight;
					$scope.traitsBase = successResponse.traitsBase;
					$scope.traitsWeight = successResponse.traitsWeight;
					$scope.domainOwnerId = successResponse.domainOwnerId;
					$scope.educationLevelWeight = successResponse.educationLevelWeight;
					}
				)
		}
	)
}


}])