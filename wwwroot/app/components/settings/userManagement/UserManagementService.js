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

			// ========== RIGHTS AND ROLES ==========
			// PERMISSION
			/**
			 * @ngdoc method
			 * @name permissions
			 * @methodOf app.ontdekJouwTalent.service:UserManagementService
			 * @parameters {Integer} id id of permission to retrieve
			 * @description Called from state 'settings.userManagement.rechtenEnRollen'
			 */
			permission: function(data){
				return APIService.permissions()
				.then(
					function(successResponse){
						return successResponse;
					}
				)
			}

			// ROLE
			/**
			 * @ngdoc method
			 * @name role
			 * @methodOf app.ontdekJouwTalent.service:UserManagementService
			 * @parameters {Integer} id id of role to retrieve
			 * @description Called from states 'settings.userManagement.rechtenEnRollen',settings.userManagement.detailTeam
			 */
			,role: function(id){
				return APIService.role(id)
				.then(
					function(successResponse){
						return successResponse;
					}
					,function(errorResponse){
						return errorResponse;
					}
				)
			}

			// dummydata voor settings - userManagement
			,requestLocalJSON:  function(data){
				return APIService.requestLocalJSON(data)
				.then(
					function(succesResponse){
						return succesResponse;
					}
				)
			}

			// UPDATEROLESANDPERMISSIONS
			/**
			 * @ngdoc method
			 * @name updateRolesAndPermissions
			 * @methodOf app.ontdekJouwTalent.service:UserManagementService
			 * @parameters {Array} rolesWithAllPermissions array with roles and permissions to update
			 * @description Called from  RightsAndRolesController $scope.save
			 */
			,updateRolesAndPermissions: function(rolesWithAllPermissions){
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

				return APIService.updateRolesAndPermissions(roles)
				.then(
					function(succesResponse){
						return succesResponse;
					}
				)
			}

			// ADDROLE
			/**
			 * @ngdoc method
			 * @name addRole
			 * @methodOf app.ontdekJouwTalent.service:UserManagementService
			 * @parameters
			 * @description Called from RightsAndRolesController $scope.addRole
			 */
			,addRole: function(){
				var role = AppConfig.APPCONSTANTS_SETTINGS_USERMANAGEMENT_ROLE;
				role.token = SessionService.getCurrentUserToken();

				return APIService.addRole([role])
				.then(
					function(succesResponse){
						return succesResponse;
					}
				)
			}

			,deleteRole: function(id){
				return APIService.deleteRole({roleId:id});
			}


			// ========== TEAMS ==========
			// listview

			,team: function(teamId){
				return APIService.team(teamId)
			}

			,addTeam: function(){
				var team = AppConfig.APPCONSTANTS_SETTINGS_USERMANAGEMENT_TEAM;
				team.token = SessionService.getCurrentUserToken();

				return APIService.addTeam({teams:[team]})
				.then(
					function(succesResponse){
						return succesResponse;
					}
				)
			}

			,deleteTeam: function(id){
				return APIService.deleteTeam({teamId:id});
			}

			,saveTeam: function(team){
				return APIService.saveTeam({teams:[team],domainOwnerId:team.domainOwnerId});
			}

			// detailView


			// ========== USERS ==========

			// USER
			/**
			 * @ngdoc method
			 * @name user
			 * @methodOf app.ontdekJouwTalent.service:UserManagementService
			 * @parameters {String} domainName optional
			 * @description Called from state 'settings.userManagement.listUsers'
			 */
			,user: function(domainName){
				return APIService.user(domainName);
			}

			// DELETEUSER
			/**
			 * @ngdoc method
			 * @name deleteUser
			 * @methodOf app.ontdekJouwTalent.service:UserManagementService
			 * @parameters
			 * @description Called from UsersController $scope.deleteUser
			 */
			,deleteUser: function(id){
				return APIService.deleteUser({personId:id});
			}

		}
	}
]);
