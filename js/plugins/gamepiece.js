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
    
    showAttackRadius: function(radius) {
      var dist = radius ;
      $('.can-move').removeClass('can-move') ;
      
      return this.each(function(){
        var $this = $(this) ;
        
        //var dist = parseInt($this.attackRadius) ;
        //var dist = 10 ;
        var my_col = parseInt($this.closest('.hex').attr('data-col')) ;
        var my_row = parseInt($this.closest('.hex').attr('data-row')) ;
        
        if ( my_row ) {
          var r ;
          var c ;
          var sel = Array() ;
          for (r=-(dist*2); r<=dist*2; r++) {
            var the_row = my_row + r ;
            var rabs = Math.abs(r) ;
            for (c=-(dist); c<=dist; c++) {
              var the_col = my_col + c ;
              var cabs = Math.abs(c) ;
              
              if ( rabs >= cabs ) {
                if ((rabs+cabs)/2 <= dist) {
                  sel.push("#hex_" + the_col + "_" + the_row) ;
                } 
              } else {
                if (rabs <= dist) {
                  sel.push("#hex_" + the_col + "_" + the_row) ;
                }
              }
            }
          }
          var selector = sel.join(',') ;
          $(selector).addClass('show-attack')
                     .delay(1000).queue(function(next){
                        $(this).removeClass('show-attack') ;
                        next() ;
                      }) ;
        }
      }) ;
    
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