$(document).ready(function(){

  hexGrid.init(20,30) ;
  turn.init({points:20}) ;
  
  $('.pc').gamePiece({attackRadius:5}) ;
  
  $('.hex').gameSpace() ; 
  
}) ;


