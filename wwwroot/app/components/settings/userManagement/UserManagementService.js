angular.module('app.ontdekJouwTalent')
.factory('UserManagementService',['APIService','AppConfig','SessionService',
	function(APIService,AppConfig,SessionService){
		return{

			// ========== RIGHTS AND ROLES ==========
			permissions: function(data){
				return APIService.permissions()
				.then(
					function(successResponse){
						return successResponse;
					}
				)
			}

			,roles: function(data){
				return APIService.roles()
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


			// ========== USERS ==========
			,user: function(domainName){
				return APIService.user(domainName);
			}

		}
	}
]);
