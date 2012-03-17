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
      var wkgSpace = pcSpace ;
      var thisSpace = $(this).gameSpace('getGridSpace') ;
      var angle;
      var $wkgSpace
      var path = [] ;
      
      var ii = 0 ;
      while (wkgSpace != thisSpace && ii < 30) {
        angle = hexGrid.getAngle(wkgSpace,thisSpace) ;
        $wkgSpace = $(hexGrid.getSelector(wkgSpace)) ;
        wkgSpace = $wkgSpace.gameSpace('getNextByAnchor',pcSpace,thisSpace) ; 
        path.push(wkgSpace) ;
        ii++ ;
      }
      hexGrid.highlightPath(path) ;
    },
    
    getNextByAngle: function(angle) {
      var thisSpace = $(this).gameSpace('getGridSpace') ;
      var nbrs = hexGrid.getNeighbors(thisSpace) ;
      var i=0, nbr, nextSpc, diff=180, nbrAngle, ancAngle, wkgDiff, ancDiff, favorite ;
      while(nbr = nbrs[i++]) {
        nbrAngle = hexGrid.getAngle(thisSpace,nbr) ;
        wkgDiff = Math.abs(angle - nbrAngle) ;
        if (wkgDiff < diff) {
          favorite = nbr ;
          diff = wkgDiff ;
        }
      }
      return favorite ;
    },
    
    getNextByAnchor: function(start,end) {
      var thisSpace = $(this).gameSpace('getGridSpace') ;
      var nbrs = hexGrid.getNeighbors(thisSpace) ;
      var i=0, nbr, nextSpc, diff=180, nbrAngle, ancAngle, wkgDiff, ancDiff, favorite ;
      var refAngle = hexGrid.getAngle(start,end) ;
      while (nbr = nbrs[i++]) {        
        ancAngle = hexGrid.getAngle(start,nbr) ;
        nbrAngle = hexGrid.getAngle(thisSpace,nbr) ;
        wkgDiff = hexGrid.diffAngles(refAngle,nbrAngle) ;
        if (wkgDiff < 90) {
          ancDiff = hexGrid.diffAngles(refAngle,ancAngle) ;
          if (ancDiff < diff) {
            favorite = nbr ;
            diff = ancDiff ;
          }
        }
      }
      return favorite ;
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