turn = {

  init: function(options) {
    var that=this ;
    this.pointsRemaining = options.points ? options.points : 20 ;
    that.updateDisplay() ;
  },
  
  subtractPoints: function(pts) {
    if (pts <= this.pointsRemaining) {
      this.pointsRemaining -= pts ;
      this.pointsLastUsed = pts ;
      return this.pointsRemaining ;
    } else {
      return -1 ;
    }
  },
  
  updateDisplay: function() {
    $('#points_remaining span').html(this.pointsRemaining) ;
    $('#points_used span').html(this.pointsLastUsed) ;
  },
  
  notice: function(str) {
    $("#player_notice").html(str) 
    setTimeout(function(){
      $("#player_notice").html("&nbsp;") ;
    }, 3000) ;
  }
}