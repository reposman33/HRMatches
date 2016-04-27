angular.module('app.ontdekJouwTalent')
.factory('UserManagementService',['APIService','AppConfig','SessionService',
	function(APIService,AppConfig,SessionService){
		return{
			permissions: function(data){
				return APIService.permissions()
				.then(
					function(successResponse){
						return successResponse.data;
					}
				)
				.catch(function(errorResponse){
					console.error('ERROR in UserManagementService.permissions: ',errorResponse)
				})
			}


			,roles: function(data){
				return APIService.roles()
				.then(
					function(successResponse){
						return successResponse.data;
					}
				)
				.catch(function(errorResponse){
					console.error('ERROR in UserManagementService.roles: ',errorResponse)
				})
			}


/*
			,load: function(data){
				return APIService.request(data)
					.then(
						function(succesResponse){
							return succesResponse.data;
						}
					)
					.catch(
						function(errorResponse){
							console.error('ERROR in APIService.requestLocal: ',errorResponse);
							return;
						}
					)
			},
*/

			,requestLocalJSON:  function(data){
				return APIService.requestLocalJSON(data)
				.then(
					function(succesResponse){
						return succesResponse;
					}
				)
				.catch(
					function(errorResponse){
						console.error('ERROR in APIService.requestLocal: ',errorResponse);
					}
				)
			}


			,updateRolesAndPermissions: function(rolesWithAllPermissions){
				var roles = [];
				var currentRole = {};

				// CHANGE THIS DATA STRUCT (ROLES) BACK TO FORMAT TAFFY API UNDERSTANDS: PERMISSIONS ARRAY CONTAINS _ONLY_ SELECTED ROLES;
				rolesWithAllPermissions.map(function(role,index,rolesWithAllPermissions){
					currentRole = {}
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
							return succesResponse.data;
						}
					)
					.catch(
						function(errorResponse){
							console.error('ERROR in APIService.request: ',errorResponse);
							return;
						}
					)
			}

			,getNewRoleId: function(role){
				role.token = SessionService.getCurrentUserToken();

				return APIService.getNewRoleId([{"roles":role}])
				.then(
					function(succesResponse){
						return succesResponse.data;
					}
				)
				.catch(
					function(errorResponse){
						console.error('ERROR in APIService.getNewRoleId: ',errorResponse);
					}
				)
			}
		}
	}
]);
