/**
 * @ngdoc controller
 * @name app.ontdekJouwTalent.controller:RightsAndRolesController
 * @description This controller contains functionality for usermanagement RightsAndRoles
 * @requires $scope,roles,permissions
 * Referring states: settings.userManagement.rechtenEnRollen
 * */
angular.module('app.ontdekJouwTalent')
.controller('RightsAndRolesController',
	['$scope','$state','$filter','AppConfig','roles','permissions','UserManagementService',
	function($scope,$state,$filter,AppConfig,roles,permissions,UserManagementService) {

		$scope.roles = roles;
		$scope.permissions = permissions;

		//FILTER FUNCTION
		var findPermissionInRole = function(rolePermission,key,arr){
			return rolePermission.id == this.id;
		}

		// EXPAND ROLES IN PROFILE WIHT NON-SELECTED ROLES
		var expandRoles = function(){
			$scope.rolesWithAllPermissions = [];
			var _role = {};
			var _rolePermission = {};

			// COPY ALL DATA OVER FROM OLD ROLE
			angular.forEach(roles,function(role,key,roles){
				_role = {};
				for(var key in role){
					_role[key] = role[key];
				}
				// PERMISISONS ARRAY IS EMPTY
				_role.PERMISSIONS = [];

				angular.forEach(permissions,function(permission,key,permissions){

					// CREATE PERMISSIONS
					_rolePermission = {id:permission.id, roleId:role.id, selected:false, permissionName:permission.permissionName};

					// IF FOUND IN ACTUAL ROLE.PERMISSIONS ARRAY IT IS SELECTED
					if(role.PERMISSIONS.find(findPermissionInRole,permission)){
						_rolePermission.selected = true;
					}

					//ADD TO ARRAY
					_role.PERMISSIONS.push(_rolePermission);

				});
				// 2 WAY DATABINDING WITH VIEW AND THIS MODEL
				$scope.rolesWithAllPermissions.push(_role);
			});
		}

		// SHOW ROLES IN ROLES-PERISSION MATRIX
		expandRoles();

		// EDIT
		/**
		 * @ngdoc method
		 * @name edit
		 * @methodOf app.ontdekJouwTalent.controller:RightsAndRolesController
		 * @description
		 * Used in generic tableView.html to edit row content
		 *
		 */
		$scope.edit = function(id){
			console.log('edit(' + id + ')');
		}


		$scope.save = function(rolesWithAllPermissions){
			UserManagementService.updateRolesAndPermissions(rolesWithAllPermissions)
			.then(
				function(successResponse){
					console.log(successResponse);
				})
			.catch(
				function(errorResponse){
					console.log(errorResponse);
				}
			);
		}

		// addrole
		/**
		 * @ngdoc method
		 * @name addRole
		 * @methodOf app.ontdekJouwTalent.controller:RightsAndRolesController
		 * @description Called when user adds a role.
		 * The roles array is updated with a new role
		 */
		$scope.addRole = function(data){
			UserManagementService.addRole()
			.then(
				function(data){
					$state.go('settings.userManagement.rechtenEnRollen',{},{reload:true});
				}
			);
		}

		// deleteRole
		/**
		 * @ngdoc method
		 * @name deleteRole
		 * @methodOf app.ontdekJouwTalent.controller:RightsAndRolesController
		 * @description Called when user deletes a role.
		 */
		$scope.deleteRole = function(id){
			UserManagementService.deleteRole(id)
			.then(
				function(successResponse){
					// REMOVE ROLE FROM ROLESWITHALLPERMISSIONS
					var allRoles = [];
					allRoles = $scope.rolesWithAllPermissions.filter(function(role,index,allRoles){
						if(role.id != id){
							return role;
						}
					});
					$scope.rolesWithAllPermissions = allRoles;
					roles = allRoles;
					console.log(successResponse);
				}
			);
		}
	}]
);
