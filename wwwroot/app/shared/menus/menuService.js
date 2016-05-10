angular.module('.ontdekJouwTalent')
service('MenuService',['ApiService',function(ApiService){
    // constructor area, do here one-time initialisations
    var menuData = {};

    ApiService.getMenus()
    .then(
        function(successResponse){
            menuData = successResponse.data;
        }
    )

    var generateMenu = function(entity){

    }

    return {

    }
}])