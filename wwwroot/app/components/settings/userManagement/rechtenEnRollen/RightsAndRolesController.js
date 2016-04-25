/**
 * @ngdoc controller
 * @name app.ontdekJouwTalent.controller:RightsAndRolesController
 * @description This controller contains functionality for usermanagement RightsAndRoles
 * @requires $scope,roles,permissions
 * Referring states: settings.userManagement.rechtenEnRollen
 * */
angular.module('app.ontdekJouwTalent')
.controller('RightsAndRolesController',
	['$scope','$filter','roles','permissions','UserManagementService',
	function($scope,$filter,roles,permissions,UserManagementService) {
		$scope.roles = roles;
		$scope.permissions = permissions;

		// EXPAND EACH ROLES.PROFILES ARRAY WITH ALL PERMISSIONS

		//FILTER FUNCTION
		var findPermissionInRole = function(rolePermission,key,arr){
			return rolePermission.id == this.id;
		}

		var findRoleById = function(role, index,roles){
			return role.id == this.id;
		}

		var rolesWithAllPermissions = [];

		// EXPAND ROLES IN PROFILE WIHT NON-SELECTED ROLES
		angular.forEach(roles,function(role,key,roles){
			var _role = {roleId: role.id, systemName: role.systemName, permissions:[]};
			angular.forEach(permissions,function(permission,key,permissions){
				var _rolePermission = {id:permission.id, roleId:role.id, selected:false};

				if(role.PERMISSIONS.find(findPermissionInRole,permission)){
					_rolePermission.selected = true;
				}

				_role.permissions.push(_rolePermission);
			});
			rolesWithAllPermissions.push(_role)
		});

		$scope.rolesWithAllPermissions = rolesWithAllPermissions;


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


		$scope.save = function(){
			//UserManagementService.updateRightsAndRoles(roles);
		}

		// UPDATE
		/**
		 * @ngdoc method
		 * @name update
		 * @methodOf app.ontdekJouwTalent.controller:RightsAndRolesController
		 * @description
		 * Called when user selects or deselects a role. The role.permissions array of the corresponding permission role is updated
		 *
		 */
		$scope.update = function(data){
			var roleId = data.substring(0,data.indexOf("_"));
			var permissionId = data.substring(data.indexOf("_") + 1,data.indexOf(","));
			var selected = data.substring(data.indexOf(",") + 1);
			var roleRemoved = false;

			// FIND THE ROLE CONTAINING UPDATED PERMISSION
			roles.map(function(role, index, roles){
				if(role.id == roleId) {
					// FIND THE PERMISSION IN ROLE PERMISSIONS
					role.PERMISSIONS.map(function (permission, index, permissions) {
						if(permission.id == permissionId) {
							// PERMISSION FOUND: USER DESELECTED IT, DELETE IT FROM ROLE.PERMISSIONS
							if(selected) { // extra check, should be true
								role.PERMISSIONS.splice(index, 1);
								roleRemoved = true;
							}
						}
					});
					if (!roleRemoved) {
						// PERMISSION WAS NOT FOUND in ROLES PERMISSIONS: USER SELECTED IT, ADD IT TO ROLE.PERMISSIONS
						role.PERMISSIONS.push({id: parseInt(permissionId), permissionName: ''}); //? API should return all permissionNames, not just of selected permissions
					}
				}
			});
		}
	}]
);
