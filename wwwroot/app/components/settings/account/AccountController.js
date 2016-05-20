/**
 * @ngdoc controller
 * @name app.ontdekJouwTalent.controller:AccountController
 * @description This controller contains functionality for Account under 'Settings'
 * @requires $scope,$state
 * Referring states: 'settings.account','settings.account.person','settings.account.password','settings.account.delete'
 * */
angular.module('app.ontdekJouwTalent')
.controller('AccountController',['$scope','$location','$state','AppConfig','APIService','data',
	function($scope,$location,$state,AppConfig,APIService,data) {
		$scope.data = data;

		/* TABS DATA */
		if(data.menu){
			$scope.tabs = [];
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
		}

		// URL
		/**
		 * @ngdoc method
		 * @name url
		 * @methodOf app.ontdekJouwTalent.controller:AccountController
		 * @description
		 * Used in Settings - Account to navigate between urls
		 *
		 */
		$scope.url = function(url) {
			var state = url.replace(/\//g,'.').substring(1)
			$state.go(state);
		}

		// UPDATEPERSON
		/**
		 * @ngdoc method
		 * @name updatePerson
		 * @methodOf app.ontdekJouwTalent.controller:AccountController
		 * @description
		 * Used in tab person of Settings - Account to update existing account data
		 *
		 */
		$scope.updateAccount = function(person) {
			APIService.call(AppConfig.API_ENDPOINTS.settings.updateAccount,{person:person});
		}

		// DELETEPERSON
		/**
		 * @ngdoc method
		 * @name deletePerson
		 * @methodOf app.ontdekJouwTalent.controller:AccountController
		 * @description
		 * Used in tab Person of Settings - Account to delete a person account
		 *
		 */
		$scope.deleteAccount = function(id) {
			APIService.call(AppConfig.API_ENDPOINTS.settings.deleteAccount,{personId:id})
			.then(
				function(successResponse){
					// log out
					$state.go('logout');
				}
			)
		}
	}]
)