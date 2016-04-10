angular.module('app.HRMatches')
.factory('RechtenEnRollenService',['APIService','AppConfig',
    function(APIService,AppConfig){
        return{
            assignRight: function(data){
                console.log('Setting right: ',data.name,' to ',data.value);
            }
        }
    }
]);
