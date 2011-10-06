/*
 * jQuery MeasureIt 1.0
 * Create by Routy Development LLC
 * http://www.getrouty.com
 *
 */
(function($){
	
	$.fn.measureit = function(user_options){

		var measureSelector = this;
			
		var options = $.extend(true,{
			onMeasurementBegin: null,
			onMeasurementEnd: null,
			enableHotkey: true,
			hotkey: 77, //Keyboard letter: m
			measurementSuffix: 'px',
			toggleElement: '#measurement-tool',
			toggleEvent: 'click'
		},user_options || {});
		
		var status = {
			initiated: false,
			active: false
		};
			
		$(options.toggleElement).bind(options.toggleEvent,function(){
			
			if(status.active == false){
				
				if(!status.initiated){
					
					$(measureSelector).css('cursor','crosshair');
					$('<div></div>').attr('id','measure-overlay').appendTo(measureSelector);
					status.initiated = true;
					
				}
				
				measureSelector.bind('mousedown.measurementTool', function(e){
					
					if (typeof options.onMeasurementBegin == 'function') options.onMeasurementBegin();
					
					$('#measure-box, #measure-box-coord').remove();
					
					start_pos = {
						x: e.pageX,
						y: e.pageY
					};
					
					var measureBox = $('<div></div>')
					.attr('id','measure-box')
					.css({
						'top': start_pos.y,
						'left': start_pos.x
					}).appendTo(this);
					
					var measureBoxCoord = $('<div></div>')
					.attr('id','measure-box-coord')
					.css({
						'top': start_pos.y,
						'left': start_pos.x
					}).text('W: 1px H: 1px').appendTo(this);
					
					$(this).bind('mousemove.measurementTool',function(e){
						
						end_pos = {
							x: e.pageX,
							y: e.pageY
						};
						
						var total_x_pos = (end_pos.x - start_pos.x);
						var total_y_pos = (end_pos.y - start_pos.y);
						
						measureBox.css({
							'left': (total_x_pos > 0) ? start_pos.x : end_pos.x,
							'top': (total_y_pos > 0) ? start_pos.y : end_pos.y,
							'width': Math.abs(total_x_pos),
							'height': Math.abs(total_y_pos)
						});
						
						measureBoxCoord.text('W: '+Math.abs(total_x_pos)+options.measurementSuffix+' H: '+Math.abs(total_y_pos)+options.measurementSuffix);
						
					});
					
					$(this).bind('mouseup.measurementTool',function(e){
						if (typeof options.onMeasurementEnd == 'function') options.onMeasurementEnd();
						$(this).unbind('mousemove.measurementTool');
					});
					
				});
				
				status.active = true;
				
			} else {
				
				measureSelector.unbind('.measurementTool');
				measureSelector.css('cursor','default');
				$('#measure-box, #measure-box-coord, #measure-overlay').remove();
				
				/*
				 * Reset statuses
				 * 
				 */
				status.initiated = false;
				status.active = false;
				
			}
		});
	
		if (options.enableHotkey){
			$(document).keydown(function(e){
				if (e.shiftKey && e.ctrlKey && e.keyCode == options.hotkey){
					$(options.toggleElement).trigger(options.toggleEvent);
				}
			});
		}
	
	};
})(jQuery);