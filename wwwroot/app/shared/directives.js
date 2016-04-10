angular.module('app.HRMatches')
.directive('onClick',function(){
	return {
		restrict: 'A'
		,scope: {
			onClick: '&'
		}
		,link: function(scope,element,attributes){
			element.bind('click',function(e){
				scope.onClick();
			});
		}
	};
})