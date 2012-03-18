(function($) {

  var methods = {
    init: function(options) {
      var settings = $.extend({
        attackRadius: 10
      },options) ;
    
      return this.each(function(){
        
        var $this = $(this) ;
        
        $this.data('attackRadius',settings.attackRadius) ;
        $this.draggable({
          revert: 'invalid' ,
          revertDuration: 500 ,
          start: function (event,ui) {
            var sp = $(this).gamePiece('getGridSpace') ;
            $('.pc.active').removeClass('active') ;
            $(this).addClass('active') ;
            $.data(this, 'start_space', sp) ;
          } ,
          stop: function (event,ui) {
            var end = $(this).gamePiece('getGridSpace') ;
            var start = $.data(this, 'start_space') ;
      
            if (start && end) {
              $('.highlight').removeClass('highlight') ;
              var path = hexGrid.astar(start,end) ;
              if (turn.subtractPoints(hexGrid.lastmove) > -1) {
                hexGrid.highlightPath(path) ;
                turn.updateDisplay() ;
              } else {
                // not enough points to move, return to original space
                var str = "#hex_" + start.posHex.col + '_' + start.posHex.row + ' .rect' ;
                //console.log(str) ;
                $(str).append(this) ;
              }        
            }      
            $(this).gamePiece('activate') ;
          }
        }) ;
        
        $this.click(function(){
          var radius = $(this).gamePiece('activate') ;
        }) ;
      }) ;
    }, 
    
    getAttackRadius: function() {
      var spc = $(this).gamePiece('getGridSpace') ;
      var radius = $(this).data('attackRadius') ;
      var spcSet = hexGrid.getRadius(spc,radius) ;
      return spcSet ;
    },
    
    getAttackableSpaces: function() {
      var radius = $(this).gamePiece('getAttackRadius') ;
      var fov = $(this).gamePiece('getFOV') ;
      var ret = hexGrid.intersectSets(radius,fov) ;
      return ret ;
    },
    
    getGridSpace: function() {
        
      var c = $(this).closest('.hex').attr('data-col') ;
      var r = $(this).closest('.hex').attr('data-row') ;
      
      if (c && r) {
        var c = parseInt(c) ;
        var r = parseInt(r) ;
        
        var xy = hexGrid.getXY(c,r) ;
        var space = hexGrid.getGridSpace(xy) ;
        //console.log(space) ;
        return space ;
        
      } else {
        return false ;
      }
    },
    
    activate: function() {
      $('.pc.active').removeClass('active') ;
      return $(this).each(function(){
        $(this).addClass('active') ;
      }) ;
    } ,
    
    getFOV: function() {
      var mySpace = $(this).gamePiece('getGridSpace') ;
      var radius = $(this).data('attackRadius') ;
      var fov = hexGrid.getFOV(mySpace,radius) ;
      return fov ;
    }
    
  } ;
  
  

  $.fn.gamePiece = function(method) {
  
    // Method calling logic
    if ( methods[method] ) {
      return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return methods.init.apply( this, arguments );
    } else {
      $.error( 'Method ' +  method + ' does not exist on jQuery.tooltip' );
    }
      
  }

})(jQuery) ;