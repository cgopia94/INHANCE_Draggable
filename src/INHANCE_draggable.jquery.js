(function ($) {
	$.fn.INHANCE_draggable = function(options) {
		var settings;

		var defaults = {
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
	    var isMouseDown = false;
	    var isClick = false;
	    var me = this;

	    var capturingHandler = function (event) {
	    	if (!isClick)
	    		event.stopPropagation();
	    	else {
	    		event.stopImmediatePropagation();
	    		isClick = false;
	    		$(event.target).trigger('click');
	    	}
	    };
	    
	    $(this).on('mousedown.draggable touchstart.draggable', function(event) {
	    	event.preventDefault();
	      event.stopImmediatePropagation();
	      event = (event.originalEvent.touches && event.originalEvent.touches[0]) || event;
	      isClick = false;
        var pos = $(this).offset();
        initDrageePos = {x: pos.left, y: pos.top};
	      startMousePos = {x: event.clientX, y: event.clientY};
	      isMouseDown = true;

	      if (typeof settings.onDragStart == 'function') settings.onDragStart(me);
	    });
	    $(document).on('mouseup.draggable touchend.draggable', function(event) {
	    	event.preventDefault();
	      event.stopPropagation();
	      event = (event.originalEvent.touches && event.originalEvent.touches[0]) || event;
	      if (isMouseDown) {
	      	if (typeof settings.onDragEnd == 'function') settings.onDragEnd(me);
		      var delta = Math.sqrt(Math.pow(startMousePos.x - event.pageX, 2) + Math.pow(startMousePos.y - event.pageY, 2));
		      if (delta < 8) isClick = true;
	      	isMouseDown = false;
	      }
	    });
	    $(document).on('mousemove.draggable touchmove.draggable', function(event) {
	    	event.preventDefault();
	    	event.stopPropagation();
	    	event = (event.originalEvent.touches && event.originalEvent.touches[0]) || event;
	    	if (isMouseDown) {
	    		var x = event.clientX - (startMousePos.x - initDrageePos.x);
        	var y = event.clientY - (startMousePos.y - initDrageePos.y);
	      	$(me).offset({left: x, top: y});
	      	if (typeof settings.onDragging == 'function') settings.onDragging(me);
	      }
	    });

	    this.destroy = function (isRemovingElement) {
	    	$(this).off('.draggable');
	    	$(document).off('.draggable');
	    	if (isRemovingElement) $(this).remove();
	    };

	    $(this).off('destroyed').on('destroyed', function (evt) {
				document.removeEventListener('click', capturingHandler);
	    });

	    document.removeEventListener('click', capturingHandler);
	    document.addEventListener('click', capturingHandler, true);
		});
	};
}(jQuery));