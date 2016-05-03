angular.module('app.ontdekJouwTalent')
.constant(API_ENDPOINTS,{
	'translation': {			// ===== LEGENDA =====
		endpoint: 'translation'	// endpoint to use for call to API
		,method: 'GET'			// http method to use
		,addToken: false		// whether to add or not a user token (supplied at login) to the API call
		,columnNames: {         // reference to columnames so we use different columnames in same shared view
			'displayName':'DisplayName'
			,'id':'id'
		}
		,parameters: {			// parameters defined by user's permissions are supplied by API
			language: 'nl_NL'
			,languageKey: ''
		}
	}
	,'updateTranslation': {
		endpoint: 'updateTranslation'
		,method: 'POST'
		,addToken: true
	}
	,'joblist': {
		endpoint: 'joblist'
		,method: 'GET'
		,addToken: true
		,parameters: []
	}
	,'trackdata': {
		endpoint: 'trackdata'
		,method: 'POST'
		,addToken: false
		, parameters: { // the parameters property is not implemented yet for other Api calls
			'trackingData': {
				'token': '' // value injected later
					,'state': '' // value injected later
					,'protocol': location.protocol
					,'hostname': location.hostname //hostname van website
					,'href': location.href // url (=incl protocol,port,hostname,querystring)
					,'appVersion': navigator.appVersion //browser versie
					,'language': navigator.language //browser taal
					,'platform': navigator.platform //voor welk plaform is de browser
					,'userAgent': navigator.userAgent //user agent
					,'screenSize': screen.width + '*' + screen.height //breedte*hoogte van scherm
					,'colorDepth': screen.colorDepth + '' //kleuren in bits/pixels
				}
			}
	},'registration': {
		endpoint: 'registration'
		,method: 'POST'
		,addToken: false
		,parameters: {
			data: { // custom format needed to inject dynamic values later in APIService
				firstName: '' // value injected later
				,infix: '' // value injected later
				,username: '' // value injected later
				,password: '' // value injected later
				,candidateOrigin: '' // value injected later
				,emailaddress: '' // value injected later
				,lastName: '' // value injected later
				,personId: '' // value injected later
			}
		}
	}
	,'settings': {
		'userManagement': {
			users: {
				endpoint: 'users'
				,method: 'GET'
				,addToken: true
			}
			,'addUser': {
				endpoint: 'users'
				, method: 'POST'
				, addToken: true
			}
			,'deleteUser': {
				endpoint: 'users'
				,method: 'DELETE'
				,addToken: true
			}
			,'invited': {
				endpoint: 'userManagement-invited'
				,method: 'GET'
				,addToken: true
			}
			,'roles': {
				endpoint: 'role'
				,method: 'GET'
				,addToken: true
			}
			,'permissions': {
				endpoint: 'permission'
				,method: 'GET'
				,addToken: true
			}
			,'teams': {
				endpoint: 'teams'
				,method: 'GET'
				,addToken: true
				,columnNames: {
					'displayName':'DisplayName'
					,'id':'id'
				}
			}
			,'jobpool': { // vacaturePool
				endpoint: 'userManagement-jobpool'
				,method: 'GET'
				,addToken: true
			}
			,'updateRolesAndPermissions': {
				endpoint: 'role'
				,method: 'PUT'
				,addToken: true
			}
			,'addRole': {
				endpoint: 'role'
				,method: 'POST'
				,addToken: true
			}
			,'deleteRole': {
				endpoint: 'role'
				,method: 'DELETE'
				,addToken: true
			}
			,'addTeam': {
				endpoint: 'teams'
				,method: 'POST'
				,addToken: true
			}
			,'deleteTeam': {
				endpoint: 'teams'
				,method: 'DELETE'
				,addToken: true
			}
			,'deleteTeamMember':{
				endpoint: 'teams'
				,method: 'DELETE'
				,addToken: true
			}
		}
	}
	,'authenticate': {
		endpoint: 'authenticate'
		,method: 'POST'
		,addToken: false
	}
	,'login': {
		endpoint: 'login'
		,method: 'POST'
		,addToken: false
	}
	,'logout': {
		endpoint: 'logout'
		,method: 'POST'
		,addToken: false
	}
	,'forgotPassword': {
		endpoint: 'forgotpassword'
		,method: 'POST'
		,addToken: false
	}
	,'resetPassword': {
		endpoint: 'resetpassword'
		,method: 'POST'
		,addToken: false
	}
	,'validateSecretKey': {
		endpoint: 'validate_secretkey'
		,method: 'POST'
		,addToken: false
	}
})