hexGrid = {

  init: function(cols,rows) {
    var that = this ;
    this.x = Math.floor(cols/2) ;
    this.y = rows ;
    
    that.initGrid() ;
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
      var c = parseInt($(obj).attr('data-col')) ;
      var r = parseInt($(obj).attr('data-row')) ;
      var elev = parseInt($(obj).attr('data-elevation')) ;
      var occ = $(obj).find('.pc').not('.active').length ;
      var xy = that.getXY(c,r) ;
      var x = xy[0] ;
      var y = xy[1] ;
      
      grid[x][y] = {
        posHex: {col:c,row:r},
        posXY: {'x':x,'y':y},
        elevation:elev,
        
        f:0,
        g:0,
        h:0,
        parent:null,
        open:false,
        closed:false,
        occupied: occ,
        id: "hex_" + c + "_" + r 
      } ; 
    }) ;

    return grid ;
  },
  
  initGrid: function() {
    this.lastmove = 0 ;
    this.grid = this.getGrid() ;
  },
  
  // accepts array of coords,
  // spc object 
  // or two discreet ints
  getXY: function() {
    var that = this ;
    var args = arguments ;
    if (typeof args[0] == 'object') {
      var c = args[0][0] || args[0].col ;
      var r = args[0][1] || args[0].row ;
    } else {
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
      var x = args[0][0] || args[0].x ;
      var y = args[0][1] || args[0].y ;
    } else {
      var x = args[0] ;
      var y = args[1] ;
    }
    
    var c = x*2 + y%2 + 1 ;
    var r = y + 1 ;
    return [c,r] ;
  },
  
  getNeighborsXY: function() {
    var grid = this.grid ;
    var args = arguments ;
    if (typeof args[0] == 'object') {
      var x = args[0][0] || args[0].x || args[0].posXY.x ;
      var y = args[0][1] || args[0].y || args[0].posXY.y ;
    } else {
      var x = args[0] ;
      var y = args[1] ;
    }
    
    x = parseInt(x) ;
    y = parseInt(y) ;

    var neighbors = Array() ;

    if (grid[x] && grid[x][y+2]) {
      neighbors.push(grid[x][y+2]) ;
    }

    if (grid[x] && grid[x][y-2]) {
      neighbors.push(grid[x][y-2]) ;
    }

    if (grid[x] && grid[x][y+1]) {
      neighbors.push(grid[x][y+1]) ;
    }

    if (grid[x] && grid[x][y-1]) {
      neighbors.push(grid[x][y-1]) ;
    }
    
    if (y%2) {

      if (grid[x+1] && grid[x+1][y-1]) {
        neighbors.push(grid[x+1][y-1])
      }
      if (grid[x+1] && grid[x+1][y+1]) {
        neighbors.push(grid[x+1][y+1])
      }
    } else {
      if (grid[x-1] && grid[x-1][y+1]) {
        neighbors.push(grid[x-1][y+1])
      }
      if (grid[x-1] && grid[x-1][y-1]) {
        neighbors.push(grid[x-1][y-1])
      }
    }
    
    return neighbors ;
  },
  
  getNeighbors: function() {
    var args = arguments ;
    if (typeof args[0] == 'object') {
      var c = args[0][0] || args[0].col || args[0].posHex.col ;
      var r = args[0][1] || args[0].row || args[0].posHex.row ;
    } else {
      var c = args[0] ;
      var r = args[1] ;
    }

    var grid = this.grid ;
    var neighbors = Array() ;

    var xy = this.getXY(c,r+2) ;
    if (grid[xy[0]] && grid[xy[0]][xy[1]]) {
      neighbors.push(grid[xy[0]][xy[1]]) ;
    }

    xy = this.getXY(c,r-2) ;
    if (grid[xy[0]] && grid[xy[0]][xy[1]]) {
      neighbors.push(grid[xy[0]][xy[1]]) ;
    }
  
    xy = this.getXY(c-1,r-1) ;
    if (grid[xy[0]] && grid[xy[0]][xy[1]]) {
      neighbors.push(grid[xy[0]][xy[1]]) ;
    }
  
    xy = this.getXY(c+1,r-1) ;
    if (grid[xy[0]] && grid[xy[0]][xy[1]]) {
      neighbors.push(grid[xy[0]][xy[1]]) ;
    }
  
    xy = this.getXY(c-1,r+1) ;
    if (grid[xy[0]] && grid[xy[0]][xy[1]]) {
      neighbors.push(grid[xy[0]][xy[1]]) ;
    }
  
    xy = this.getXY(c+1,r+1) ;
    if (grid[xy[0]] && grid[xy[0]][xy[1]]) {
      neighbors.push(grid[xy[0]][xy[1]]) ;
    }

    return neighbors ;
  },
  
  getDistance: function(pos1,pos2) {
    var c1 = pos1.col || pos1[0] || pos1.posHex.col ;
    var r1 = pos1.row || pos1[1] || pos1.posHex.row ;
    var c2 = pos2.col || pos2[0] || pos2.posHex.col ;
    var r2 = pos2.row || pos2[1] || pos2.posHex.row ;
    
    var row_dist = Math.abs(r1 - r2) ;
    var col_dist = Math.abs(c1 - c2) ;
    var distance = col_dist > row_dist ? col_dist : (row_dist + col_dist) / 2;
    
    return distance ;
  },
  
  getDistanceXY: function(pos1,pos2) {
    var that = this ;
    
    cr1 = that.getCR(pos1) ;
    cr2 = that.getCR(pos2) ;
    
    var ret = that.getDistance(cr1,cr2) ;
    return ret ;
  },
  
  getAngle: function(pos1,pos2) {
    var c1 = pos1.col || pos1[0] || pos1.posHex.col ;
    var r1 = pos1.row || pos1[1] || pos1.posHex.row ;
    var c2 = pos2.col || pos2[0] || pos2.posHex.col ;
    var r2 = pos2.row || pos2[1] || pos2.posHex.row ;
    
    const mult = 22/38 ;
    
    var cdiff = c2 - c1 ;
    var rdiff = r2 - r1 ;
    var rdiffSq = rdiff * mult ;
    var tan = rdiffSq/cdiff ;
    var angle = Math.atan(tan) ;
    angle = angle * (180/3.14159) ;
    angle = Math.round(angle) ;
    
    if (cdiff < 0 && rdiff >= 0) {
      angle = 180 + angle ;
    }
    
    if (rdiff < 0 && cdiff < 0 ) {
      angle = -(180 - angle) ;
    }
    
    return angle ;
  },
  
  diffAngles: function(ang1,ang2) {
    diff = Math.abs(ang1 - ang2) ;
    if (diff > 180) {
      diff = 360 - diff ;
    }
    return diff ;
  },
  
  getAngleXY: function(pos1,pos2) {
    var that = this ;
    
    cr1 = that.getCR(pos1) ;
    cr2 = that.getCR(pos2) ;
    
    var ret = that.getAngle(cr1,cr2) ;
    return ret ;
  },
  
  
  getGridSpace: function() {
    var args = arguments ;
    if (typeof args[0] == 'object') {
      var x = args[0][0] ;
      var y = args[0][1] ;
    } else {
      var x = args[0] ;
      var y = args[1] ;
    }
  
    var grid = this.grid ;
    if (grid[x] && grid[x][y]) {
      return grid[x][y] ;
    } else {
      return false ;
    }
  },
  
  getGridSpaceCR: function() {
    var args = arguments ;
    if (typeof args[0] == 'object') {
      var c = args[0][0] ;
      var r = args[0][1] ;
    } else {
      var c = args[0] ;
      var r = args[1] ;
    }
  
    var xy = this.getXY(c,r) ;
    return this.getGridSpace(xy) ;
  } ,
  
  getSelector: function(spc) {
    var c = spc.posHex.col ;
    var r = spc.posHex.row ;
    var sel = "#hex_" + c + '_' + r ;
    return sel ;
  } ,
  
  astar: function(cr1,cr2) {
    this.initGrid() ;
    var xy1 = this.getXY(cr1.posHex.col, cr1.posHex.row) ;
    var xy2 = this.getXY(cr2.posHex.col, cr2.posHex.row) ;
    var start = this.getGridSpace(xy1) ;
    var end = this.getGridSpace(xy2) ;
    
		var openList   = [];
		var closedList = [];
		openList.push(start);
		
		
		while(openList.length > 0) {
 
			// Grab the lowest f(x) to process next
			var lowInd = 0;
			for(var i=0; i<openList.length; i++) {
				if(openList[i].f < openList[lowInd].f) { lowInd = i; }
			}
			var currentNode = openList[lowInd];
 
			// End case -- result has been found, return the traced path
			if(currentNode.posXY == end.posXY) {
				var curr = currentNode;
				var ret = [];
				while(curr.parent) {
				  this.lastmove += curr.expense ;
					ret.push(curr);
					curr = curr.parent;
				}
				return ret.reverse();
			}
 
			// Normal case -- move currentNode from open to closed, process each of its neighbors
			openList.splice(openList.indexOf(currentNode),1);
			closedList.push(currentNode);
			var neighbors = hexGrid.getNeighborsXY(currentNode);
 
			for(var i=0; i<neighbors.length;i++) {
				var neighbor = neighbors[i];
				var elChange = Math.abs(neighbor.elevation - currentNode.elevation) ;
				if(closedList.indexOf(neighbor) >=0 || neighbor.occupied || elChange > 1) {
					// not a valid node to process, skip to next neighbor
					continue;
				}
				
 
				// g score is the shortest distance from start to current node, we need to check if
				//	 the path we have arrived at this neighbor is the shortest one we have seen yet
				var climb = neighbor.elevation - currentNode.elevation ;
				climb = climb <= 0 ? 0 : climb ;
				neighbor.expense = climb + 1 ;
				var gScore = currentNode.g + neighbor.expense; // 1 is the distance from a node to its neighbor
				var gScoreIsBest = false;
 
 
				if(openList.indexOf(neighbor) == -1) {
					// This the the first time we have arrived at this node, it must be the best
					// Also, we need to take the h (heuristic) score since we haven't done so yet
 
					gScoreIsBest = true;
					neighbor.h = hexGrid.getDistanceXY(neighbor.posXY, end.posXY) + neighbor.elevation;
					openList.push(neighbor);
				}
				else if(gScore < neighbor.g) {
					// We have already seen the node, but last time it had a worse g (distance from start)
					gScoreIsBest = true;
				}
 
				if(gScoreIsBest) {
					// Found an optimal (so far) path to this node.	 Store info on how we got here and
					//	just how good it really is...
					neighbor.parent = currentNode;
					neighbor.g = gScore;
					neighbor.f = neighbor.g + neighbor.h;
					neighbor.debug = neighbor.posHex.c + '/' + neighbor.posHex.r + "--" + "F: " + neighbor.f + " -- G: " + neighbor.g + " -- H: " + neighbor.h;
					
				}
			}
		}
 
		// No result was found -- empty array signifies failure to find path
		return [];
	},
	
  getDirectPath: function(startSpace,endSpace) {
    //console.log("Get Direct Path") ;
    //console.log(startSpace) ;
    //console.log(endSpace) ;
    var wkgSpace = startSpace ;
    var angle;
    var path = [startSpace] ;
    
    var ii = 0 ;
    while (wkgSpace && (wkgSpace != endSpace) && (ii < 30)) {
      //console.log("While") ;
      //console.log(wkgSpace) ;
      angle = hexGrid.getAngle(wkgSpace,endSpace,true) ;
      wkgSpace = hexGrid.getNextByAnchor(startSpace,endSpace,wkgSpace) ; 
      path.push(wkgSpace) ;
      ii++ ;
    }
    return path ;
  },
  
  getNextByAnchor: function(start,end,thisSpace) {
    var nbrs = hexGrid.getNeighbors(thisSpace) ;
    var i=0, nbr, nextSpc, diff=180, nbrAngle, ancAngle, wkgDiff, ancDiff, favorite ;
    var refAngle = hexGrid.getAngle(start,end) ;
    while (nbr = nbrs[i++]) {        
      ancAngle = hexGrid.getAngle(start,nbr) ;
      nbrAngle = hexGrid.getAngle(thisSpace,nbr) ;
      wkgDiff = hexGrid.diffAngles(refAngle,nbrAngle) ;
      if (wkgDiff < 90) {
        ancDiff = hexGrid.diffAngles(refAngle,ancAngle) ;
        if (ancDiff < diff) {
          favorite = nbr ;
          diff = ancDiff ;
        }
      }
    }
    return favorite ;
  },
  
  checkLOS: function(start,end) {
    //console.log("Check LOS=========") ;
    //console.log(start);
    //console.log(end) ;
    path = hexGrid.getDirectPath(start,end) ;
    var i=1, spc, los=true;
    var losSlope = (end.elevation - start.elevation) / (path.length - 1) ;
    while ((spc=path[i++])) {
      var ptSlope = (spc.elevation - start.elevation) / (i - 1) ;
      if (ptSlope > losSlope) {
        los = false ;
      }
    }
    
    return los ;
  },
  
  getFOV: function(spc) {
    var canSee = [] ;
    
    $('.hex').each( function(idx,obj) {
      var wkg = $(obj).gameSpace('getGridSpace') ;
      if (hexGrid.checkLOS(spc,wkg)) {
        canSee.push(wkg) ;
      }
    }) ;
    return canSee ;
  },
  
  getRadius: function(spc,radius) {
    var ret = [] ;
    
    $('.hex').each(function(idx,obj){
      var wkg = $(obj).gameSpace('getGridSpace') ;
      if (hexGrid.getDistance(wkg,spc) <= radius) {
        ret.push(wkg) ;
      }
    }) ;    
    
    return ret ;
  },
  
  intersectSets: function(arr1,arr2) {
    var r = [], o = {}, l = arr2.length, i, v, spc ;
    for (i = 0; i < l; i++) {
        o[arr2[i].id] = true;
    }
    l = arr1.length;
    for (i = 0; i < l; i++) {
        v = arr1[i].id ;
        spc = arr1[i] ;
        if (v in o) {
            r.push(spc);
        }
    }
    return r;
  },
	
	highlightPath: function(path) {
    $('.hex').removeClass('highlight') ;
    for (i=0;i<path.length;i++) {
      var hx = path[i] ;
      var c = hx.posHex.col ;
      var r = hx.posHex.row ;
      var sel = "#hex_" + c + '_' + r ;
      $(sel).addClass('highlight') ;
    }	
	},
	
	highlightSpace: function(spc) {
    $('.hex').removeClass('highlight') ;
    var c = spc.posHex.col ;
    var r = spc.posHex.row ;
    var sel = "#hex_" + c + '_' + r ;
    $(sel).addClass('highlight') ;
	}  
}
