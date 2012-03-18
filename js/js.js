$(document).ready(function(){

  hexGrid.init(20,30) ;
  turn.init({points:20}) ;
  
  $('.pc').gamePiece({attackRadius:5}) ;  
  $('.hex').gameSpace() ; 
  
  $('#action_check_fov').click(function(e){
    e.preventDefault() ;
    var activeSpc = $('.pc.active').gamePiece('getGridSpace') ;
    if (activeSpc) {
      var fov = hexGrid.getFOV(activeSpc) ;
      hexGrid.highlightPath(fov) ;
    } else {
      turn.notice("No Piece Selected") ;
    }
  }) ; 
  
  $('#action_show_attack_radius').click(function(e){
    e.preventDefault() ;
    var $activePc = $('.pc.active') ;
    if ($activePc.length) {
      var set = $activePc.gamePiece('getAttackableSpaces') ;
      turn.notice("Showing Attackable Spaces") ;
      hexGrid.highlightPath(set) ;
    } else {
      turn.notice("No Piece Selected") ;
    }
  }) ;
  
  $('.hex').click(function(e){
    e.preventDefault() ;
    var activeSpc = $('.pc.active').gamePiece('getGridSpace') ;
    if (activeSpc) {
      var los = hexGrid.checkLOS(activeSpc,$(this).gameSpace('getGridSpace')) ;
    }
  }) ;
}) ;


