/**
 * The Sexy Curls JQuery Plugin
 * By Elliott Kember - http://twitter.com/elliottkember
 * Released under the MIT license (MIT-LICENSE.txt)
 * 
 * My only request is: please don't over-use this plugin.
 * If this ends up being used all over the internets, and becomes "that annoying effect", I'll be upset.    
 *
 * I dragged a curl, and I liked it - I hope @jeresig don't mind it.
 */

(function($){
  $.fn.fold = function(options) {
    var ie55 = (navigator.appName == "Microsoft Internet Explorer" && parseInt(navigator.appVersion) == 4 && navigator.appVersion.indexOf("MSIE 5.5") != -1);
    var ie6 = (navigator.appName == "Microsoft Internet Explorer" && parseInt(navigator.appVersion) == 4 && navigator.appVersion.indexOf("MSIE 6.0") != -1);
    
    // We just won't show it for IE5.5 and IE6. Go away. I'm really tempted to write "document.location= 'http://www.getfirefox.com';" here.
    if (ie55 || ie6) {this.remove(); return true;}
  
    // New - you don't have to specify options!
    options = options || {};
    
    // Default awesomeness
    var defaults = {
      directory: '.',         // The directory we're in
      side: 'left',           // change me to "right" if you want rightness
      turnImage: 'fold.png',  // The triangle-shaped fold image
      maxHeight: 400,         // The maximum height. Duh.
      starting_width: 80,     // The height and width 
      starting_height: 80,    // with which to start (these should probably be camelCase, d'oh.)
      autoCurl: false         // If this is set to true, the fold will curl/uncurl on mouseover/mouseout.
    };

    // Change turnImage if we're running the default image, and they've specified 'right'
    if (options.side == 'right' && !options.turnImage) defaults.turnImage = 'fold-sw.png';
  
    // Merge options with the defaults
    var options = $.extend(defaults, options);
    
    // Set up the wrapper objects
    var turn_hideme = $('<div id="turn_hideme">');
    var turn_wrapper = $('<div id="turn_wrapper">');
    var turn_object = $('<div id="turn_object">');
    var img = $('<img id="turn_fold" src="'+ (options.directory+'/'+options.turnImage) +'">');

    // Set starting width and height of our turn-o-ma-bob
    turn_object.css({
      width: options.starting_width, 
      height: options.starting_height
    });
  
    // There are different CSS considerations for a top-right fold.
    if (options.side == 'right') turn_wrapper.addClass('right');
  
    // Rappin', I'm rappin' - I'm rap-rap-rappin'.
    this.wrap(turn_wrapper).wrap(turn_object).after(img).wrap(turn_hideme);
    
    // If you want autoCurl, you don't get scrolling. Why? Because it looks silly.
    
    turn_wrapper = $('#turn_wrapper');
    turn_object = $('#turn_object');

    if (!options.autoCurl) {
      // Hit 'em with the drag-stick because it ain't gonna curl itself!
      turn_object.resizable({ 
        maxHeight: options.maxHeight, 
        aspectRatio: true,
        ratio: true,
        border: false,
        dragHandle: false,
        knobHandles: true,
        handles:  options.side == 'left' ? 'se' : 'sw'
      });
    } else {
      // Thanks to @zzzrByte for this bit!
      turn_wrapper.hover(
        function(){
          turn_object.stop().animate({
            width: options.maxHeight,
            height: options.maxHeight
          });
        },
        function(){
          turn_object.stop().animate({
            width: options.starting_height,
            height: options.starting_height
          });
        }
      );
    }
  };
})(jQuery);
