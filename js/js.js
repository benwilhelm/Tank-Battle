$(document).ready(function(){

  hexGrid.init(20,30) ;
  turn.init({points:20}) ;
  
  $('.pc').gamePiece({attackRadius:5}) ;
  
  $('.hex').droppable({
    accept: '.pc' ,
    hoverClass: 'drop-hover',
    drop: function(event,ui) {
      $(this).find('.rect').append(ui.draggable) ;
      ui.draggable.css({top:0,left:0}) ;
    }
  }) ; 
  
}) ;


