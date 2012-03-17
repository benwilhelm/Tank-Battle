$(document).ready(function(){

  hexGrid.init(20,30) ;
  turn.init({points:20}) ;
  
  $('.pc').gamePiece({attackRadius:5}) ;  
  $('.hex').gameSpace() ; 
  
  $('.hex').click(function(){
    var activeSpace = $('.pc.active').closest('.hex').gameSpace('getGridSpace') ;
    var thisSpace = $(this).gameSpace('getGridSpace') ;
    var los = hexGrid.checkLOS(thisSpace,activeSpace) ;
    console.log(los) ;
  }) ;
  
}) ;


