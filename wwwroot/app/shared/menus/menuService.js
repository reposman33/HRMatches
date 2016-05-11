angular.module('.ontdekJouwTalent')
service('MenuService',['ApiService',function(ApiService){
    // constructor area, do here one-time initialisations
    var menuData = {};

    ApiService.getMenu(token,context)
    .then(
        function(successResponse){
            menuData = successResponse.data;
        }
    )

    var generateMenu = function(entity){

    }

    return {

    }

    /*
    * menudata voor Settings linker menu
    *
    * /*
     [{
     "id": 1,
     "displayName":"SETTINGS_MY_ACCOUNT",
     "action":"settings.myaccount",
     "title":"SETTINGS_MY_ACCOUNT_DESCRIPTION"
     },{
     "id": 1,
     "displayName":"SETTINGS_MY_COMPANY",
     "action":"settings.mycompany",
     "title":"SETTINGS_MY_COMPANY_DESCRIPTION"
     },{
     "id": 1,
     "displayName":"SETTINGS_USERMANAGEMENT",
     "action":"settings.usermanagement",
     "title":"SETTINGS_USERMANAGEMENT_DESCRIPTION"
     },{
     "id": 1,
     "displayName":"SETTINGS_TAGMANAGEMENT",
     "action":"settings.tagmanagement",
     "title":"SETTINGS_TAGMANAGEMENT_DESCRIPTION"
     },{
     "id": 1,
     "displayName":"SETTINGS_DOCTEMPLATES",
     "action":"settings.doctemplates",
     "title":"SETTINGS_DOCTEMPLATES_DESCRIPTION"
     },{
     "id": 1,
     "displayName":"SETTINGS_REFERENCES",
     "action":"settings.references",
     "title":"SETTINGS_REFERENCES_DESCRIPTION"
     },{
     "id": 1,
     "displayName":"SETTINGS_MATCHING",
     "action":"settings.matching",
     "title":"SETTINGS_MATCHING_DESCRIPTION"
     }]
     */
}])