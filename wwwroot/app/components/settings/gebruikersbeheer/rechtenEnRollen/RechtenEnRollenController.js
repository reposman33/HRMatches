angular.module('app.HRMatches')
.controller('RechtenEnRollenController',
	['$scope','AppConfig','RechtenEnRollenService','SessionService',
	function($scope,AppConfig,RechtenEnRollenService,SessionService) {
		// DUMMY DATA HERE
		var data = {
			configuration: {
                title: 'Rechten en Rollen'
                ,buttons: {
                    newRole: {
                        allow: true
                    }
                    ,save: {
                        allow: true
                    }
                }
                ,verticalAxis: {
                    title: "Rollen"
                }
                ,horizontalAxis: {
                    title: "Rechten"
                    ,columnHeaders: ['Account','Activiteiten bekijken','Administratie','Bedrijfsinformatie wijzigen','Beoordelen','Berichten versturen','Gebruikersbeheer','Kandidaten bekijken','Matching','Statistieken bekijken','Tag beheer','Vacature aanmaken','Vacature bewerken','Vacature publiceren','Vacature status wijzigen']
                }
			}
			,data: [
                {title:"Administrator",data:[
                    {value: true,name:'permission_61_6'},
                    {value: false,name:'permission_61_4'},
                    {value: true,name:'permission_61_4'},
                    {value: false,name:'permission_61_1'},
                    {value: true,name:'permission_61_12'},
                    {value: true,name:'permission_61_2'},
                    {value: false,name:'permission_61_3'},
                    {value: false,name:'permission_61_4'},
                    {value: true,name:'permission_61_5'},
                    {value: true,name:'permission_61_6'},
                    {value: false,name:'permission_61_7'},
                    {value: true,name:'permission_61_12'},
                    {value: false,name:'permission_61_14'},
                    {value: true,name:'permission_61_15'},
                    {value: true,name:'permission_61_16'}
                  ]}
					,{title:"Beoordelaar",data:[
                    {value: false,name:'permission_61_2'},
                    {value: true,name:'permission_30_4'},
                    {value: false,name:'permission_30_5'},
                    {value: false,name:'permission_30_6'},
                    {value: false,name:'permission_30_8'},
                    {value: true,name:'permission_30_9'},
                    {value: true,name:'permission_30_11'},
                    {value: false,name:'permission_30_13'},
                    {value: true,name:'permission_30_10'},
                    {value: true,name:'permission_30_1'},
                    {value: true,name:'permission_30_3'},
                    {value: true,name:'permission_30_7'},
                    {value: false,name:'permission_30_14'},
                    {value: true,name:'permission_30_19'},
                    {value: true,name:'permission_30_18'}
                ]}
					,{title:"Manager",data:[
                    {value: true,name:'permission_19_5'},
                    {value: false,name:'permission_19_1'},
                    {value: false,name:'permission_19_12'},
                    {value: false,name:'permission_19_19'},
                    {value: true,name:'permission_19_10'},
                    {value: false,name:'permission_19_11'},
                    {value: false,name:'permission_19_8'},
                    {value: true,name:'permission_19_4'},
                    {value: true,name:'permission_19_3'},
                    {value: true,name:'permission_19_12'},
                    {value: true,name:'permission_19_13'},
                    {value: false,name:'permission_19_2'},
                    {value: true,name:'permission_19_7'},
                    {value: false,name:'permission_19_6'},
                    {value: true,name:'permission_19_15'}
                ]}
				]
		}

		$scope.data = data.data;
        $scope.viewConfig = data.configuration;
        $scope.assignRight = function(data){
            RechtenEnRollenService.assignRight(data);
        }
	}]);
