(function ($) {
	$.fn.INHANCE_draggable = function(options) {
		var settings;

		var defaults = {
			container : null,
			lock: null,
			onDragStart: null,
			onDragEnd: null,
			onDragging: null
		};

		settings = $.extend(defaults, options);

		$.event.special.destroyed = {
	    remove: function(o) {
	      if (o.handler) {
	        o.handler();
	      }
	    }
	  };

		return this.each(function () {
			var initDrageePos;
			var startMousePos;
			var isDragStarted = false;
	    var isMouseDown = false;
	    var isClick = false;
	    var me = this;

	    var capturingHandler = function (event) {
	    	if (!isClick) 
					event.stopImmediatePropagation();
			};
			
			var validateClick = function (event) {
				var delta = Math.sqrt(Math.pow(startMousePos.x - event.pageX, 2) + Math.pow(startMousePos.y - event.pageY, 2));
				return delta < 8;
			};

			var container = document.querySelector(settings.container);
			if (container) {
				var myWidth = $(me).outerWidth();
				var myHeight = $(me).outerHeight();
				var cBorder = {
					width: $(container).outerWidth() - $(container).width(),
					height: $(container).outerHeight() - $(container).height()
				};
				var containerInfo = {position: 
					{
						x: $(container).offset().left + cBorder.width / 2, 
						y: $(container).offset().top + cBorder.height / 2}, 
						width: $(container).width(), 
						height: $(container).height()
					};
			}
			
			
	    $(this).on('mousedown.draggable touchstart.draggable', function(event) {
	    	event.preventDefault();
	      event.stopImmediatePropagation();
	      event = (event.originalEvent.touches && event.originalEvent.touches[0]) || event;
	      isClick = false;
        var pos = $(this).offset();
        initDrageePos = {x: pos.left, y: pos.top};
	      startMousePos = {x: event.clientX, y: event.clientY};
	      isMouseDown = true;
	    });
	    $(document).on('mouseup.draggable touchend.draggable', function(event) {
	    	event.preventDefault();
	      event.stopPropagation();
				event = (event.originalEvent.touches && event.originalEvent.touches[0]) || event;
				
				if (isMouseDown) {
					var isValidClick = validateClick(event);
	      	if (!isValidClick && typeof settings.onDragEnd == 'function') settings.onDragEnd(me);
		      if (isValidClick) isClick = true;
					isMouseDown = false;
					isDragStarted = false;
	      }
	    });
	    $(document).on('mousemove.draggable touchmove.draggable', function(event) {
	    	event.preventDefault();
	    	event.stopPropagation();
	    	event = (event.originalEvent.touches && event.originalEvent.touches[0]) || event;
	    	if (isMouseDown) {
	    		var x = settings.lock == 'x' ? initDrageePos.x : event.clientX - (startMousePos.x - initDrageePos.x);
					var y = settings.lock == 'y' ? initDrageePos.y : event.clientY - (startMousePos.y - initDrageePos.y);

					// container
					if (container) {
						if (x == containerInfo.position.x || x < containerInfo.position.x) {
							x = containerInfo.position.x;
						}
						if (x + myWidth == containerInfo.position.x + containerInfo.width || x + myWidth > containerInfo.position.x + containerInfo.width) {
							x = containerInfo.position.x + containerInfo.width - myWidth;
						}
						if (y == containerInfo.position.y || y < containerInfo.position.y) {
							y = containerInfo.position.y;
						}
						if (y + myHeight == containerInfo.position.y + containerInfo.height || y + myHeight > containerInfo.position.y + containerInfo.height) {
							y = containerInfo.position.y + containerInfo.height - myHeight;
						}
					}

					$(me).offset({left: x, top: y});
					
					var isValidClick = validateClick(event);
					if (!isDragStarted && !isValidClick && typeof settings.onDragStart == 'function') {
						isDragStarted = true;
						settings.onDragStart(me);
					}
					if (!isValidClick && typeof settings.onDragging == 'function')
						settings.onDragging(me);
					
	      }
	    });

	    this.destroy = function (isRemovingElement) {
	    	$(this).off('.draggable');
	    	$(document).off('.draggable');
	    	if (isRemovingElement) $(this).remove();
	    };
			
			var that = this;
	    $(this).off('destroyed').on('destroyed', function (evt) {
				that.removeEventListener('click', capturingHandler);	    	
	    });

			this.addEventListener('click', capturingHandler, true);
		});
	};
}(jQuery));