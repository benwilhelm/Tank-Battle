$(document).ready(function(){

  hexGrid.init(20,30) ;
  //hexGrid.logGrid() ;

  var pointsRemaining = 20 ;
  $('#points_remaining span').html(pointsRemaining) ;
  
  $('.pc').draggable({
    revert: 'invalid' ,
    revertDuration: 500 ,
    start: function (event,ui) {
      var sp = $(this).getThisSpace() ;
      $('.pc.active').removeClass('active') ;
      $(this).addClass('active') ;
      $.data(this, 'start_space', sp) ;
    } ,
    stop: function (event,ui) {
      var sp = $(this).getThisSpace() ;
      $.data(this, 'end_space', sp) ;
      
      var start = $.data(this, 'start_space') ;
      var end = $.data(this, 'end_space') ;

      if (start && end) {
        $('.highlight').removeClass('highlight') ;
        var path = hexGrid.astar(start,end) ;
        var pts_used = hexGrid.lastmove ;
        if (pts_used <= pointsRemaining) {

          // higlight path
          for (i=0;i<path.length;i++) {
            var hx = path[i] ;
            var c = hx.posHex.col ;
            var r = hx.posHex.row ;
            var sel = "#hex_" + c + '_' + r ;
            $(sel).addClass('highlight') ;
          }
          
          // update and display remaining points
          pointsRemaining -= pts_used ;
          $('#points_remaining span').html(pointsRemaining) ;
          $('#points_used span').html(pts_used) ;
        } else {
          var str = "#hex_" + start.col + '_' + start.row + ' .rect' ;
          $(str).append(this) ;
        }        
      }      
    }
  }).click(function(e){
    e.preventDefault() ;
    $(this).showAttackRadius({distance:10}) ;
  }) ;
  
  $('.hex').droppable({
    accept: '.pc' ,
    hoverClass: 'drop-hover',
    drop: function(event,ui) {
      $(this).find('.rect').append(ui.draggable) ;
      ui.draggable.css({top:0,left:0}) ;
    }
  }) ; 
  
  $('.hex').click(function(e){
    e.preventDefault() ;
    $('.highlight').removeClass('highlight') ;
    spc = $(this).getThisSpace() ;
    var neighbors = hexGrid.getNeighbors(spc) ;
    var sel = String() ;
    for (i=0; i<neighbors.length; i++) {
      var s = neighbors[i] ;
      sel = '#hex_' + s[0] + '_' + s[1] ;
      $(sel).addClass('highlight') ;
    }
  }) ; 
}) ;


(function($) {
  jQuery.fn.showAttackRadius = function(options) {
    
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
  }
  
  
  jQuery.fn.getThisSpace = function() {
    var $this = $(this) ;
    
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
  
})( jQuery ) ;

