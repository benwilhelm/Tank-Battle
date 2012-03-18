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
    }, 
    
    getGridSpace: function() {
      
      var c = $(this).attr('data-col') ;
      var r = $(this).attr('data-row') ;
      
      var c = parseInt(c) ;
      var r = parseInt(r) ;
      
      var space = hexGrid.getGridSpaceCR(c,r) ;
      return space ;          
    },
    
    
    getDirectPath: function(pcSpace) {
      var pcSpace = pcSpace ? pcSpace : $('.pc.active').gamePiece('getGridSpace') ;      
      var thisSpace = $(this).gameSpace('getGridSpace') ;
      return hexGrid.getDirectPath(pcSpace,thisSpace) ;
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