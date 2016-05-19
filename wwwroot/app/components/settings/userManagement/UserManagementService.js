/**
 * @ngdoc service
 * @name app.ontdekJouwTalent.service:UserManagementService
 * @description
 * This service contains functionality for calls to the REST backend for Usermanagement
 * Dependencies: $http,AppConfig,SessionService
 * */
angular.module('app.ontdekJouwTalent')
.factory('UserManagementService',['APIService','AppConfig','SessionService',
	function(APIService,AppConfig,SessionService){
		return{

			// UPDATEROLESANDPERMISSIONS
			/**
			 * @ngdoc method
			 * @name updateRolesAndPermissions
			 * @methodOf app.ontdekJouwTalent.service:UserManagementService
			 * @parameters {Array} rolesWithAllPermissions array with roles and permissions to update
			 * @description Called from  RightsAndRolesController $scope.save
			 */
			updateRolesAndPermissions: function(rolesWithAllPermissions){
				var roles = [];
				var currentRole = {};

				// CHANGE THIS DATA STRUCT (ROLES) BACK TO FORMAT TAFFY API UNDERSTANDS: PERMISSIONS ARRAY CONTAINS _ONLY_ SELECTED ROLES;
				rolesWithAllPermissions.map(function(role,index,rolesWithAllPermissions){
					currentRole = {};
					for(var key in role){
						currentRole[key] = role[key];
					}

					currentRole.PERMISSIONS = [];

					role.PERMISSIONS.map(function(permission, index, permissions){
						if(permission.selected){
							currentRole.PERMISSIONS.push(permission);
						}
					});
					roles.push(currentRole);
				});

				return APIService.call(AppConfig.API_ENDPOINTS.settings.userManagement.updateRolesAndPermissions,{roles:roles})
				.then(
					function(succesResponse){
						return succesResponse;
					}
				)
			}

			,getPerson: function(){
				return APIService.call(AppConfig.API_ENDPOINTS.settings.userManagement.users,{personId:SessionService.getCurrentUserPersonId()})
			}
		}
	}
]);
