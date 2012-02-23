$(document).ready(function(){
  var pointsRemaining = 20 ;
  $('#points_remaining span').html(pointsRemaining) ;
  
  $('.pc').draggable({
    revert: 'invalid' ,
    revertDuration: 500 ,
    start: function (event,ui) {
      var sp = $(this).getThisSpace() ;
      $.data(this, 'start_space', sp) ;
    } ,
    stop: function (event,ui) {
      var sp = $(this).getThisSpace() ;
      $.data(this, 'end_space', sp) ;
      
      var start = $.data(this, 'start_space') ;
      var end = $.data(this, 'end_space') ;

      if (start && end) {
        var row_dist = Math.abs(start.row - end.row) ;
        var col_dist = Math.abs(start.col - end.col) ;
        var pts_used = col_dist > row_dist ? col_dist : (row_dist + col_dist) / 2;
        
        if (pts_used <= pointsRemaining) {
          pointsRemaining -= pts_used ;
          $('#points_remaining span').html(pointsRemaining) ;
          $('#points_used span').html(pts_used) ;
        } else {
          var str = "#hex_" + start.row + '_' + start.col + ' .rect' ;
          $(str).append(this) ;
        }
      }      
    }
  }).click(function(){
    $(this).showAvailableMoves({distance:10}) ;
  }) ;
  
  $('.hex').droppable({
    accept: '.pc' ,
    hoverClass: 'drop-hover',
    drop: function(event,ui) {
      $(this).find('.rect').append(ui.draggable) ;
      ui.draggable.css({top:0,left:0}) ;
    }
  }) ;  
}) ;


(function($) {
  jQuery.fn.showAvailableMoves = function(options) {
    
    $('.can-move').removeClass('can-move') ;
    var defaults = { distance:5 }
    var settings = $.extend(defaults,options) ;
    
    return this.each(function(){
      var $this = $(this) ;
      
      var dist = parseInt(settings['distance']) ;
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
                sel.push(".hex.col-" + the_col + ".row-" + the_row) ;
              } 
            } else {
              if (rabs <= dist) {
                sel.push(".hex.col-" + the_col + ".row-" + the_row) ;
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
  }
  
  
  jQuery.fn.getThisSpace = function() {
    var $this = $(this) ;
    
    var r = $(this).closest('.hex').attr('data-row') ;
    var c = $(this).closest('.hex').attr('data-col') ;
    
    if (r && c) {

      var r = parseInt(r) ;
      var c = parseInt(c) ;
      
      var space = {row: r, col: c} ;
      return space ;
      
    } else {
      return false ;
    }
  }
})( jQuery ) ;