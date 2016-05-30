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
						$scope.data.detailView.educationPassed = successResponse.educationPassed;
						$scope.data.detailView.experienceLevelBelowZero = successResponse.experienceLevelBelowZero;
						$scope.data.detailView.educationLevelExponent = successResponse.educationLevelExponent;
						$scope.data.detailView.experienceSubAreaWeight = successResponse.experienceSubAreaWeight;
						$scope.data.detailView.experienceWeight = successResponse.experienceWeight;
						$scope.data.detailView.languageWeight = successResponse.languageWeight;
						$scope.data.detailView.traitsExponent = successResponse.traitsExponent;
						$scope.data.detailView.educationWeight = successResponse.educationWeight;

						$scope.data.detailView.deleted = successResponse.deleted;
						$scope.data.detailView.skillWeight = successResponse.skillWeight;
						$scope.data.detailView.experienceLevelWeight = successResponse.experienceLevelWeight;
						$scope.data.detailView.languageExponent = successResponse.languageExponent;

						$scope.data.detailView.educationAreaWeight = successResponse.educationAreaWeight;
						$scope.data.detailView.competenceExponent = successResponse.competenceExponent;
						$scope.data.detailView.experienceAreaWeight = successResponse.experienceAreaWeight;
						$scope.data.detailView.created = successResponse.created;
						$scope.data.detailView.experienceLevelAboveZero = successResponse.experienceLevelAboveZero;

						$scope.data.detailView.competenceWeight = successResponse.competenceWeight;
						$scope.data.detailView.skillExponent = successResponse.skillExponent;
						$scope.data.detailView.educationNotPassed = successResponse.educationNotPassed;
						$scope.data.detailView.updated = successResponse.updated;
						$scope.data.detailView.generalSkillWeight = successResponse.generalSkillWeight;
						$scope.data.detailView.knowledgeWeight = successResponse.knowledgeWeight;
						$scope.data.detailView.personalityWeight = successResponse.personalityWeight;
						$scope.data.detailView.traitsBase = successResponse.traitsBase;
						$scope.data.detailView.traitsWeight = successResponse.traitsWeight;
						$scope.data.detailView.domainOwnerId = successResponse.domainOwnerId;
						$scope.data.detailView.educationLevelWeight = successResponse.educationLevelWeight;
					}
				)
			}
		)
	}


}])