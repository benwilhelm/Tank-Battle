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
            var sp = $(this).gamePiece('getThisSpace') ;
            $('.pc.active').removeClass('active') ;
            $(this).addClass('active') ;
            $.data(this, 'start_space', sp) ;
          } ,
          stop: function (event,ui) {
            var sp = $(this).gamePiece('getThisSpace') ;
            $.data(this, 'end_space', sp) ;
            
            var start = $.data(this, 'start_space') ;
            var end = $.data(this, 'end_space') ;
      
            if (start && end) {
              $('.highlight').removeClass('highlight') ;
              var path = hexGrid.astar(start,end) ;
              if (turn.subtractPoints(hexGrid.lastmove) > -1) {
                hexGrid.highlightPath(path) ;
                turn.updateDisplay() ;
              } else {
                var str = "#hex_" + start.col + '_' + start.row + ' .rect' ;
                $(str).append(this) ;
              }        
            }      
          }
        }) ;
        
        $this.click(function(){
          var radius = $(this).data('attackRadius') ;
          $(this).gamePiece('showAttackRadius',radius) ;
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
          $(selector).addClass('can-move') ;
          
  //        .delay(1000).queue(function(next){
  //          $(this).removeClass('can-move') ;
  //          next() ;
  //        }) ;
        }
      }) ;
    
    },
    
    getThisSpace: function() {
        
      var r = $(this).closest('.hex').attr('data-row') ;
      var c = $(this).closest('.hex').attr('data-col') ;
      var trn = $(this).closest('.hex').attr('data-terrain') ;
      
      if (r && c) {
        var r = parseInt(r) ;
        var c = parseInt(c) ;
        
        var space = {col: c, row: r, terrain: trn} ;
        return space ;
        
      } else {
        return false ;
      }
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