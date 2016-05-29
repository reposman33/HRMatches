/*
* The MIT License (MIT)

 Copyright (c) 2013 Eric Jacobsen

 Permission is hereby granted, free of charge, to any person obtaining a copy of
 this software and associated documentation files (the "Software"), to deal in
 the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 https://github.com/EricWVGG/AngularSlideables

 */
angular.module('app.ontdekJouwTalent')
.directive('slideable', function () {
	return {
		restrict:'C',
		compile: function (element, attr) {
			// wrap tag
			var contents = element.html();
			element.html('<div class="slideable_content" style="margin:0 !important; padding:0 !important" >' + contents + '</div>');

			return function postLink(scope, element, attrs) {
				// default properties
				attrs.duration = (!attrs.duration) ? '1s' : attrs.duration;
				attrs.easing = (!attrs.easing) ? 'ease-in-out' : attrs.easing;
				element.css({
					'overflow': 'hidden',
					'height': '0px',
					'transitionProperty': 'height',
					'transitionDuration': attrs.duration,
					'transitionTimingFunction': attrs.easing
				});
			};
		}
	};
})
.directive('slideToggle', function() {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			var target, content;

			attrs.expanded = false;

			element.bind('click', function() {
				if (!target) target = document.querySelector(attrs.slideToggle);
				if (!content) content = target.querySelector('.slideable_content');

				if(!attrs.expanded) {
					content.style.border = '1px solid rgba(0,0,0,0)';
					var y = content.clientHeight;
					content.style.border = 0;
					target.style.height = y + 'px';
				} else {
					target.style.height = '0px';
				}
				attrs.expanded = !attrs.expanded;
			});
		}
	}
});
