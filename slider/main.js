(function($){
    jQuery.fn.mySlider = function(options){
		var defaults = {
			containerHeight: 300,
			itemWidth: 400, 
			autoSlide: false,
			slideShowSpeed: 1000,
			prevHtml: '<i class="material-icons prev">chevron_left</i>',
			nextHtml: '<i class="material-icons next">chevron_right</i>'
		}
		var methods = {
			canClick: true,
			swipeStart: false,
			startPosition: null,
			leftScroll: 0,
			longTouch: false,
			clickPopup : function(img){
				var html = '<div class="img-popup-layer"></div>\
				<div class="img-popup-container">\
					<div class="img-popup-wrapper">\
					<a class="close-img-popup">&#10005</a>\
					<div class="img-popup">\
						<img src="' + img + '">\
					</div>\
					</div>\
				</div>'
				$(document).on('click','.close-img-popup',function(){
					$('.img-popup-layer,.img-popup-container').remove();
				});
				return $('body').append(html);
			},
			clickNext: function(width, container, speed){

				if(methods.canClick){
						methods.canClick = false;
						var firstItem = $(container).find('li:first');
						firstItem.animate({marginLeft: -width}, speed, function(){
						firstItem.remove().appendTo(container);
						firstItem.css('margin-left', 0);
						var lastItem = $(container).find('li:last');
						methods.canClick = true;
						methods.events(lastItem, container);
					});
					
				}
			},
			clickPrev: function(width, container, speed){

				if(methods.canClick){
					methods.canClick = false;
				var lastItem = $(container).find('li:last');
				lastItem.remove().prependTo(container).css('margin-left', -width);
				var firstItem = $(container).find('li:first');
				methods.events(firstItem, container);
				lastItem.animate({marginLeft: 0}, speed , function(){
					methods.canClick = true;
				});
				
				}
			},
			autoSlide: function(width, container, speed, onHover){

				if(onHover){
					clearInterval(slide);
				}else{
					slide = setInterval(function(){
						methods.clickNext(width, container, speed);
					},speed);
				}
			},
			swipeSlider: function(e, container){
				var childWidth = $(container).children().width();
				var scrolling = $(container).scrollLeft();
				if(methods.startPosition > e.screenX){
					$(container).animate({scrollLeft: methods.startPosition - e.screenX + methods.leftScroll},0,function(){
						methods.longTouch = true;
					});
					if(scrolling >= childWidth ){
						methods.clickNext(childWidth, container , 250)
					}
				}
				if(methods.startPosition < e.screenX){
					$(container).animate({scrollLeft:methods.leftScroll + methods.startPosition - e.screenX },0,function(){
						methods.longTouch = true;
					});
					if(scrolling == 0){
						methods.clickPrev(childWidth, container , 250)
					}
				}
			},
			events: function(child , that){
				$(child).on("mousedown",function(e) {
					methods.startPosition  = e.screenX;
					methods.swipeStart = true;
					methods.longTouch = false;
					methods.mouseUp(child, that);
				})
				.on("mousemove", function(e) {
					if(methods.swipeStart){
						methods.swipeSlider(e, that);
					}
				})
				.on('click',function(e){
					if(!methods.longTouch){
						var src = $(this).data('img');
						methods.clickPopup(src);
					}
					
					methods.longTouch = false;
				});
				
			},
			mouseUp: function(child, that){
				$(document).on("mouseup", function(e) {
					if(methods.swipeStart){
						methods.endPosition  = e.screenX;
						methods.leftScroll = $(that).scrollLeft();
						methods.swipeStart = false;
					}
				});
			},
			stopAutoSlide: function(item, width, container, speed, onHover){
				$(item).on('mouseenter',function(){
					methods.autoSlide(width, container, speed, onHover)
				});
			},
			startAutoSlide: function(item, width, container, speed, onHover){
				$(item).on('mouseleave', function(){
					methods.autoSlide(width, container, speed, onHover);
				})
			}
		}	
		return this.each(function() {
			var that = this;
			$(that).wrap('<div class="slider-wrapper"></div>');
			$(that).addClass('slider');
			if(defaults){
				var settings = $.extend({}, defaults, options);
			}
			var child = $(that).children();
			$(that).css('height', settings.containerHeight).css('width', settings.itemWidth * child.length);
			child.css('min-width', settings.itemWidth).width(settings.itemWidth);
			if(child.length > 1){
				let container = $(that).parent();
				container.append(settings.nextHtml).prepend(settings.prevHtml);
				container.width(settings.itemWidth * child.length - 200+'px');
				var next = $(container).find('.next')
				$(next).on('click',function(){
					methods.clickNext(settings.itemWidth, that , settings.slideShowSpeed);
				})
				var prev = 	$(container).find('.prev');
				
				$(prev).on('click',$.throttle(settings.slideShowSpeed, function(){
					methods.clickPrev(settings.itemWidth, that , settings.slideShowSpeed);
				}))
				.on(('mouseenter',function(){
					methods.autoSlide(settings.itemWidth, that , settings.slideShowSpeed , false);
				}))
				methods.events(child, that);
				if(settings.autoSlide){
					methods.autoSlide(settings.itemWidth, that , settings.slideShowSpeed , false);
					methods.stopAutoSlide(next, settings.itemWidth, that , settings.slideShowSpeed, true);
					methods.startAutoSlide(next,settings.itemWidth, that , settings.slideShowSpeed, false);
					methods.stopAutoSlide(prev, settings.itemWidth, that , settings.slideShowSpeed, true);
					methods.startAutoSlide(prev,settings.itemWidth, that , settings.slideShowSpeed, false);
					methods.stopAutoSlide(that, settings.itemWidth, that , settings.slideShowSpeed, true);
					methods.startAutoSlide(that,settings.itemWidth, that , settings.slideShowSpeed, false);
				}
			}
			
		});
		

}})(jQuery);

$('.slider-0').mySlider({
	itemWidth: 550
});
$('.slider-2').mySlider({
	itemWidth: 350
});
$('.slider-1').mySlider({
	itemWidth: 450
});