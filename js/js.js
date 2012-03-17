$(document).ready(function(){

  hexGrid.init(20,30) ;
  turn.init({points:20}) ;
  
  $('.pc').gamePiece({attackRadius:5}) ;  
  $('.hex').gameSpace() ; 
  
  $('.hex').click(function(){
    var clickSpc = $(this).gameSpace('getGridSpace') ;
    var pcSpc = $('.pc.active').gamePiece('getGridSpace') ;
    var angle = hexGrid.getAngle(pcSpc,clickSpc) ;
    console.log(angle) ;
    $(this).gameSpace('getLOShex') ;
  }) ;
  
}) ;


