/**
 * @ngdoc controller
 * @name app.ontdekJouwTalent.controller:RightsAndRolesController
 * @description This controller contains functionality for usermanagement RightsAndRoles
 * @requires $scope,roles,permissions
 * Referring states: settings.userManagement.rechtenEnRollen
 * */
angular.module('app.ontdekJouwTalent')
.controller('RightsAndRolesController',
	['$scope','$filter','AppConfig','roles','permissions','UserManagementService',
	function($scope,$filter,AppConfig,roles,permissions,UserManagementService) {

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
			UserManagementService.updateRolesAndPermissions(rolesWithAllPermissions);
		}

		// UPDATE
		/**
		 * @ngdoc method
		 * @name update
		 * @methodOf app.ontdekJouwTalent.controller:RightsAndRolesController
		 * @description Called when user selects or deselects a role.
		 * The role.permissions array of the corresponding permission role is updated
		 * @param {string} data contains roleId, permisisonId, checkbox status _before_ change and permission name
		 */

/*
	2) dan is onderstaande loop om role.PERMISSION array te updaten niet meer nodig: er is een 2 way databinding tussen model
	(rolesWithAllPermissions) en view

		$scope.updatePermission = function(data){
			var roleId = data.substring(0,data.indexOf("_"));
			var permissionId = data.substring(data.indexOf("_") + 1,data.indexOf(","));
			var selected = data.substring(data.indexOf(",") + 1);
			var permissionName = data.substring(data.indexOf("|") + 1);
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
						role.PERMISSIONS.push({id: parseInt(permissionId), permissionName: permissionName}); //? API should return all permissionNames, not just of selected permissions
					}
				}
			});
		}
 */


		// addrole
		/**
		 * @ngdoc method
		 * @name addRole
		 * @methodOf app.ontdekJouwTalent.controller:RightsAndRolesController
		 * @description Called when user adds a role.
		 * The roles array is updated with a new role
		 */
		$scope.addRole = function(data){
			// ADD NEW ROLE TO ROLES
			UserManagementService.getNewRoleId()
				.then(function(newId){
					AppConfig.APPCONSTANTS_SETTINGS_USERMANAGEMENT_ROLE.id = newId.id;
				});

			roles.push(newRole);
			// CREATE NEW rolesWithAllPermissions DATA STRUCT
			expandRoles();// (implicit update view)
		}
	}]
);
