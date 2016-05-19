/**
 * @ngdoc controller
 * @name app.ontdekJouwTalent.controller:AccountController
 * @description This controller contains functionality for Account under 'Settings'
 * @requires $scope,$state
 * Referring states: 'settings.account','settings.account.person','settings.account.password','settings.account.delete'
 * */
angular.module('app.ontdekJouwTalent')
.controller('AccountController',['$scope','$location','$state','data',
	function($scope,$location,$state,data) {
		$scope.data = data;
		$scope.tabs = [];
		/* TABS DATA */
		for (var i=0; i<data.menu.length; i++) {
			$scope.tabs.push(
				{
					title: data.menu[i].title,
					url: data.menu[i].url,
					displayName: data.menu[i].displayName
				}
			);
		}

		// FIND ACTIVE TAB THAT CORRESPONDS TO CURRENT STATE
		$scope.tabs.findIndex(function(el,ind,arr){
			//el.url == full url: '/setting/userManagement', $state.current.url = relative url: '/userManagement'
			//translate full url to state ion order 2 compare with @state.current.name
			if(el.url.replace(/\//g,'.').substring(1) == $state.current.name){
				$scope.activeTab = ind;
			}
		})
		/*END TABS DATA */

		$scope.url = function(url) {
			$location.url(url);
		}

	}]
)