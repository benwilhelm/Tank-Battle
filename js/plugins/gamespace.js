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
    
    getLOS: function(pcSpace) {
      var pcSpace = pcSpace ? pcSpace : $('.pc.active').gamePiece('getGridSpace') ;      
      var thisSpace = $(this).gameSpace('getGridSpace') ;
      var c1 = pcSpace.posHex.col ;
      var c2 = thisSpace.posHex.col ;
      var r1 = pcSpace.posHex.row ;
      var r2 = thisSpace.posHex.row ;
      var lastcol = c1 ;

      var cdiff = c2 - c1 ;
      //console.log("CDiff: " + cdiff) ;
      var rdiff = r2 - r1 ;
      //console.log("RDiff: " + rdiff) ;
      
      var path = [] ;
        
      if (Math.abs(cdiff) >= Math.abs(rdiff) ) {
        var slope = parseFloat(rdiff)/cdiff ;
        //console.log("Slope: " + slope) ;
        // negative multiplier
        var n = Math.abs(cdiff)/cdiff ;

        for ( i=0; i<=Math.abs(cdiff); i++ ) {
          //console.log("i: " + i) ;
          
          var ci = c1 + n*i ;
          var ri = parseInt( r1 + (i * slope * n) ) ;
          //console.log( "ci: " + ci + ", lastcol: " + lastcol) ;
          if ((ci % 2 != ri % 2) && (lastcol != ci)) {
            //console.log('Shift') ;
            ri += 1 ;
          }
          path.push(hexGrid.getGridSpaceCR(ci,ri)) ;
          lastcol = ci ;
          //console.log(ci + "/" + ri) ;
          
          if (i == cdiff && ri != r2) {
            path.push(hexGrid.getGridSpace(c2,r2)) ;
            //console.log(c2 + "/" + r2 + "**") ;
          }
        }
      } else {
        var slope = parseFloat(cdiff)/rdiff ;
        //console.log("slope: " + slope) ;
        // negative multiplier
        var n = Math.abs(rdiff)/rdiff ;

        for ( i=0; i<=Math.abs(rdiff); i++ ) {
          //console.log("i: " + i) ;
          var ri = r1 + n*i ;
          var ci = parseInt(c1 + (i * slope * n)) ;
          //console.log( "ci: " + ci + ", lastcol: " + lastcol) ;
          if ((ci % 2 != ri % 2) && (lastcol != ci)) {
            ci -= 1 ;
          }
          var sl = '#hex_' + ci + '_' + ri ;
          if ($(sl).length) {
            path.push(hexGrid.getGridSpaceCR(ci,ri)) ;
          }
          lastcol = ci ;
          //console.log(ci + "," + ri) ;
          
          if (i == rdiff && ci != c2) {
            path.push(hexGrid.getGridSpace(c2,r2)) ;
            //console.log(c2 + "," + r2 + "**") ;
          }
        }
      }
      
      hexGrid.highlightPath(path) ;     
    },
    
    
    getLOShex: function(pcSpace) {
      var pcSpace = pcSpace ? pcSpace : $('.pc.active').gamePiece('getGridSpace') ;      
      var thisSpace = $(this).gameSpace('getGridSpace') ;
      var angle;
      var $pcSpace
      var nextSpc, wkgSpc ;
      var path = [] ;
      
      //console.log("PATH=================") ;
      while (pcSpace != thisSpace) {
        angle = hexGrid.getAngle(pcSpace,thisSpace) ;
        //console.log(angle) ;
        $pcSpace = hexGrid.getJQSpace(pcSpace) ;
        pcSpace = $pcSpace.gameSpace('getNextByAngle',angle) ; 
        path.push(pcSpace) ;
        //console.log(pcSpace) ;
      }
      hexGrid.highlightPath(path) ;
    },
    
    getNextByAngle: function(angle) {
      //console.log("ANGLE=================") ;
      var thisSpace = $(this).gameSpace('getGridSpace') ;
      var nbrs = hexGrid.getNeighbors(thisSpace) ;
      var i=0, nbr, nextSpc, diff=180, nbrAngle, wkgDiff, favorite ;
      while(nbr = nbrs[i++]) {
        nbrAngle = hexGrid.getAngle(thisSpace,nbr) ;
        //console.log(nbr.posHex.col + ", " + nbr.posHex.row + ": " + nbrAngle) ;
        wkgDiff = Math.abs(angle - nbrAngle) ;
        if (wkgDiff < diff) {
          favorite = nbr ;
          diff = wkgDiff ;
        }
      }
      hexGrid.highlightSpace(favorite) ;
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