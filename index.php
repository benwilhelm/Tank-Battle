<?php 

  $show_coords = (bool)$_GET['show_coordinates'] ;
?>


<html>
  <head>
    <title>Hex Playground</title>
    <link rel="stylesheet" href="css/ui-lightness/jquery-ui-1.8.17.custom.css" />
    <link rel="stylesheet" href="css/style.css" />
    
    <script type="text/javascript" src='js/jquery-1.7.1.min.js' ></script>
    <script type="text/javascript" src='js/jquery-ui-1.8.17.custom.min.js' ></script>
    <script type="text/javascript" src='js/objects/hexgrid.js' ></script>
    <script type="text/javascript" src='js/objects/turn.js' ></script>
    <script type="text/javascript" src='js/plugins/gamepiece.js' ></script>
    <script type="text/javascript" src='js/plugins/gamespace.js' ></script>
    <script type="text/javascript" src='js/js.js' ></script>
  </head>
  <body>
	

    <div id="game_board">
  
      <div id="piece_box">
        <?php for ($pc=1; $pc<=5; $pc++) : ?>
        <p id='pc_<?php echo $pc ?>' class="pc">P</p>
        <?php endfor ;  ?>
      </div>
  
      <?php for ($row=30; $row>=1; $row--) : ?>
        <?php for ($c=1; $c<=10; $c++) : ?>
          
          <?php // determine hex classes
           include 'terrain-map.php' ;
           $col = $row % 2 ? ($c*2)-1 : $c*2 ;
           $hexClass = "hex row-{$row} col-{$col} " ; 
           $hexClass .= $row % 2 ? '' : 'alt' ;
           $elevation = $elevationMap[30-$row][$c-1] ;
          ?>
          
          <div id='hex_<?php echo $col ?>_<?php echo $row ?>' class="<?php echo $hexClass ?>" data-col='<?php echo $col ?>' data-row='<?php echo $row ?>' data-elevation='<?php echo $elevation ?>'>
            <div class="rect">
              <p class="coords">
                <?php echo $show_coords ? "{$col}/{$row}" : "&nbsp;" ; ?>
              </p>
              <p class="elevation"><?php echo $elevation ?></p>
            </div>
            <div class="tri top left"></div>
            <div class="tri top right"></div>
            <div class="tri bottom left"></div>
            <div class="tri bottom right"></div>
          </div><!-- .hex -->
        <?php endfor ; ?>
      <?php endfor ; #row ?>
    
      <div class="clear"></div>
    </div><!-- #game_board -->
          
    <div id="info_pane">
      <p id="points_remaining">Points Remaining: <span></span></p>
      <p id="points_used">Points Used: <span></span></p>
      
      <p id="tank_starts"></p>
      <p id="tank_lands"></p>
    </div>
	
  </body>
</html>
