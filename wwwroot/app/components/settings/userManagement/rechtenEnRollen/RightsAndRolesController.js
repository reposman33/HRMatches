/**
 * @ngdoc controller
 * @name app.ontdekJouwTalent.controller:RightsAndRolesController
 * @description This controller contains functionality for usermanagement RightsAndRoles
 * @requires $scope,roles,permissions
 * Referring states: settings.userManagement.rechtenEnRollen
 * */
angular.module('app.ontdekJouwTalent')
.controller('RightsAndRolesController',
	['$scope','$filter','roles','permissions',
	function($scope,$filter,roles,permissions) {
		$scope.roles = roles;
		$scope.permissions = permissions;

		// EXPAND EACH ROLES.PROFILES ARRAY WITH ALL PERMISSIONS

		//FILTER FUNCTION
		var findPermissionInRole = function(rolePermission,key,arr){
			return rolePermission.id === this.id;
		}

		var rolesWithAllPermissions = [];

		// EXPAND ROLES IN PROFILE WIHT NON-SELECTED ROLES
		angular.forEach(roles,function(role,key,roles){
			var _role = {systemName: role.systemName, permissions:[]};
			angular.forEach(permissions,function(permission,key,permissions){
				var _rolePermission = {id: permission.id, roleId: role.id, selected: false};

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


		// UPDATE
		/**
		 * @ngdoc method
		 * @name update
		 * @methodOf app.ontdekJouwTalent.controller:RightsAndRolesController
		 * @description
		 * Used in Settings.userManagement.RightsAndRoles to assign role-selected rights
		 *
		 */
		$scope.update = function(data){
			$scope.dirtyPermissions = $filter('filter')($scope.rolesWithAllPermissions, { Selected: true }, true);
			UserManagementService.updateRightsAndRols(data);
		}

		$scope.$watch('role',
			function(newValue){
				console.log(newValue);
			});
	}]
);
