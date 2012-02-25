hexGrid = {

  init: function(cols,rows) {
    this.x = Math.floor(cols/2) ;
    this.y = rows ;
  },  
    
  getGrid: function() {
    var x = this.x ;
    var y = this.y ;
    var that = this ;
    var grid = new Array(x) ;
    for (i=0; i<x; i++) {
      grid[i] = new Array(y) ;
    }
    
    $('.hex').each(function(idx,obj){
      var spc = {} ;
      var c = $(obj).attr('data-col') ;
      var r = $(obj).attr('data-row') ;
      var trn = $(obj).attr('data-terrain') ;
      var xy = that.getXY(c,r) ;
      var x = xy[0] ;
      var y = xy[1] ;
      
      grid[x][y] = trn ; 
    }) ;

    return grid ;
  },
  
  // accepts array of coords,
  // spc object 
  // or two discreet ints
  getXY: function(c,r) {
    var that = this ;
    var args = arguments ;
    if (typeof args[0] == 'object') {
      var c = args[0][0] || args[0].col ;
      var r = args[0][1] || args[0].row ;
    } else if (typeof args[0] == 'number' && typeof args[1] == number) {
      var c = args[0] ;
      var r = args[1] ;
    }

    var x = that.getXfromC(c) ;
    var y = that.getYfromR(r) ;
    return [x,y] ;
  },
  
  getXfromC: function(c) {
    return Math.ceil(c/2) - 1 ;
  },
  
  getYfromR: function(r) {
    return r - 1 ;
  },
  
  // accepts array of coords,
  // spc object 
  // or two discreet ints
  getCR: function() {
    var that = this ;
    var args = arguments ;
    if (typeof args[0] == 'object') {
      var x = args[0][0] || args[0].col ;
      var y = args[0][1] || args[0].row ;
    } else if (typeof args[0] == 'number' && typeof args[1] == number) {
      var x = args[0] ;
      var y = args[1] ;
    }
    
    var c = x*2 + y%2 + 1 ;
    var r = y + 1 ;
    return [c,r] ;
  },
  
  getNeighborsXY: function() {
    var args = arguments ;
    if (typeof args[0] == 'object') {
      var c = args[0][0] || args[0].col ;
      var r = args[0][1] || args[0].row ;
    } else if (typeof args[0] == 'number' && typeof args[1] == number) {
      var c = args[0] ;
      var r = args[1] ;
    }

    var neighbors = Array() ;
    neighbors.push([x,y+2]) ;
    neighbors.push([x,y-2]) ;
    neighbors.push([x,y+1]) ;
    neighbors.push([x,y-1]) ;
    
    if (y%2) {
      neighbors.push([x+1,y-1])
      neighbors.push([x+1,y+1])
    } else {
      neighbors.push([x-1,y+1])
      neighbors.push([x-1,y-1])
    }
    
    return neighbors ;
  },
  
  getNeighbors: function() {
    var args = arguments ;
    if (typeof args[0] == 'object') {
      var c = args[0][0] || args[0].col ;
      var r = args[0][1] || args[0].row ;
    } else if (typeof args[0] == 'number' && typeof args[1] == number) {
      var c = args[0] ;
      var r = args[1] ;
    }

    var neighbors = Array() ;
    neighbors.push([c,r+2]) ;
    neighbors.push([c,r-2]) ;
    neighbors.push([c-1,r-1]) ;
    neighbors.push([c+1,r-1]) ;
    neighbors.push([c-1,r+1]) ;
    neighbors.push([c+1,r+1]) ;
    return neighbors ;
  }
}
