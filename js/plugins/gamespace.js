(function($) {

  var methods = {
    init: function(options) {
      var settings = $.extend({
        
      },options) ;
    
      return this.each(function(){
        var $this = $(this) ;
        $this.droppable({
          accept: '.pc' ,
          hoverClass: 'drop-hover',
          drop: function(event,ui) {
            $(this).find('.rect').append(ui.draggable) ;
            ui.draggable.css({top:0,left:0}) ;
          }
        }) ;
      }) ;
    }
  } ;
  
  

  $.fn.gameSpace = function(method) {
  
    // Method calling logic
    if ( methods[method] ) {
      return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return methods.init.apply( this, arguments );
    } else {
      $.error( 'Method ' +  method + ' does not exist on jQuery.tooltip' );
      return false ;
    } 
  }

})(jQuery) ;