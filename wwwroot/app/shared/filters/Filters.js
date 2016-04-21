angular.module('app.ontdekJouwTalent')
.filter('pagination',function(){
	return function(pages,currentPage,pageSize){
		if(angular.isArray(pages)){
			var start = (currentPage-1) * pageSize;
			var end = ((currentPage-1) * pageSize) + pageSize - 1;
			return pages.slice(start,end);
		}
	}
})