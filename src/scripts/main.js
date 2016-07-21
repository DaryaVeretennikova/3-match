const GEM_SIZE = 32;
const GEM_SPACING = 2;
const GEM_SIZE_SPACED = GEM_SIZE + GEM_SPACING;
let BOARD_COLS;
let BOARD_ROWS;

let game = new Phaser.Game(500, 500, Phaser.AUTO);

let GameState = {
  preload: function() {
    this.game.load.image('blue', 'assets/images/gems/blue.png');
    this.game.load.image('green', 'assets/images/gems/green.png');
    this.game.load.image('purple', 'assets/images/gems/purple.png');
    this.game.load.image('red', 'assets/images/gems/red.png');
    this.game.load.image('sky-blue', 'assets/images/gems/sky-blue.png');
    this.game.load.image('silver', 'assets/images/gems/silver.png');
  },
  create: function() {
    this.game.stage.backgroundColor = '#ebebeb';

    this.tileTypes = [
      'blue',
      'green',
      'purple',
      'red',
      'sky-blue',
      'silver'
    ];

    this.score = 0;

    this.activeTile1 = null;
    this.activeTile2 = null;

    this.canMove = false;

    this.tileWidth = this.game.cache.getImage('blue').width;
    this.tileHeight = this.game.cache.getImage('blue').height;

    this.tiles = this.game.add.group();



    //@TODO fullfill grid (width and height of canvas)
    //this.tileGrid = [];

    this.tileGrid = [
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null]
    ];

    this.random = new Phaser.RandomDataGenerator(Date.now());

    this.initTiles();
  },
  update: function() {
    if(this.activeTile1 && !this.activeTile2){
        //Get the location of where the pointer is currently
        let hoverX = this.game.input.x;
        let hoverY = this.game.input.y;

        //Figure out what position on the grid that translates to
        let hoverPosX = Math.floor(hoverX / this.tileWidth);
        let hoverPosY = Math.floor(hoverY / this.tileHeight);

        //See if the user had dragged over to another position on the grid
        let difX = (hoverPosX - this.startPosX);
        let difY = (hoverPosY - this.startPosY);

        //Make sure we are within the bounds of the grid
        if(!(hoverPosY > this.tileGrid[0].length - 1 || hoverPosY < 0) && !(hoverPosX > this.tileGrid.length - 1 || hoverPosX < 0)){

            //If the user has dragged an entire tiles width or height in the x or y direction
            //trigger a tile swap
            if((Math.abs(difY) == 1 && difX == 0) || (Math.abs(difX) == 1 && difY ==0)){

                //Prevent the player from making more moves whilst checking is in progress
                this.canMove = false;

                //Set the second active tile (the one where the user dragged to)
                this.activeTile2 = this.tileGrid[hoverPosX][hoverPosY];

                //Swap the two active tiles
                this.swapTiles();

                //After the swap has occurred, check the grid for any matches
                this.game.time.events.add(500, () => {
                    this.checkMatch();
                });
            }

        }

    }

  },

  initTiles: function() {
    let tileGridLength = this.tileGrid.length;

    for (let i = 0; i < tileGridLength; i++) {
      for (let j = 0; j < tileGridLength; j++) {
        let tile = this.addTile(i, j);

        this.tileGrid[i][j] = tile;
      }
    }

    //Once the tiles are ready, check for any matches on the grid
    this.game.time.events.add(600, () => {
        this.checkMatch();
    });
  },

  addTile: function(x, y) {
    let tileToAdd = this.tileTypes[this.random.integerInRange(0, this.tileTypes.length - 1)];
    let tile = this.tiles.create((x * this.tileWidth) + this.tileWidth / 2, 0, tileToAdd);

    this.game.add.tween(tile).to(
      {y: y * this.tileHeight + (this.tileHeight / 2)},
      500,
      Phaser.Easing.Linear.In,
      true
    );

    //Set the tiles anchor point to the center
    tile.anchor.setTo(0.5, 0.5);

    //Enable input on the tile
    tile.inputEnabled = true;

    //Keep track of the type of tile that was added
    tile.tileType = tileToAdd;

    //Trigger the tileDown function whenever the user clicks or taps on this tile
    tile.events.onInputDown.add(this.tileDown, this);

    return tile;
  },

  tileDown: function(tile, pointer) {

    //Keep track of where the user originally clicked
    if(this.canMove){
        this.activeTile1 = tile;

        this.startPosX = (tile.x - this.tileWidth / 2) / this.tileWidth;
        this.startPosY = (tile.y - this.tileHeight / 2) / this.tileHeight;
    }

  },

  tileUp: function(){

      //Reset the active tiles
      this.activeTile1 = null;
      this.activeTile2 = null;

  },

  swapTiles: function(){

    //If there are two active tiles, swap their positions
    if (this.activeTile1 && this.activeTile2) {

        let tile1Pos = {
          x:(this.activeTile1.x - this.tileWidth / 2) / this.tileWidth,
          y:(this.activeTile1.y - this.tileHeight / 2) / this.tileHeight
        };
        let tile2Pos = {
          x:(this.activeTile2.x - this.tileWidth / 2) / this.tileWidth,
          y:(this.activeTile2.y - this.tileHeight / 2) / this.tileHeight
        };

        //Swap them in our "theoretical" grid
        this.tileGrid[tile1Pos.x][tile1Pos.y] = this.activeTile2;
        this.tileGrid[tile2Pos.x][tile2Pos.y] = this.activeTile1;

        //Actually move them on the screen
        this.game.add.tween(this.activeTile1).to({
          x:tile2Pos.x * this.tileWidth + (this.tileWidth/2),
          y:tile2Pos.y * this.tileHeight + (this.tileHeight/2)
        }, 200, Phaser.Easing.Linear.In, true);
        this.game.add.tween(this.activeTile2).to({
          x:tile1Pos.x * this.tileWidth + (this.tileWidth/2),
          y:tile1Pos.y * this.tileHeight + (this.tileHeight/2)
        }, 200, Phaser.Easing.Linear.In, true);

        this.activeTile1 = this.tileGrid[tile1Pos.x][tile1Pos.y];
        this.activeTile2 = this.tileGrid[tile2Pos.x][tile2Pos.y];
    }
  },
  checkMatch: function() {

    //Call the getMatches function to check for spots where there is
    //a run of three or more tiles in a row
    let matches = this.getMatches(this.tileGrid);

    //If there are matches, remove them
    if (matches.length > 0){

        //Remove the tiles
        this.removeTileGroup(matches);

        //Move the tiles currently on the board into their new positions
        this.resetTile();

        //Fill the board with new tiles wherever there is an empty spot
        this.fillTile();

        //Trigger the tileUp event to reset the active tiles
        this.game.time.events.add(500, () => {
            this.tileUp();
        });

        //Check again to see if the repositioning of tiles caused any new matches
        this.game.time.events.add(600, () => {
            this.checkMatch();
        });

    }
    else {

        //No match so just swap the tiles back to their original position and reset
        this.swapTiles();
        this.game.time.events.add(500, () => {
            this.tileUp();
            this.canMove = true;
        });
    }

  },
  getMatches: function(tileGrid){

    let matches = [];
    let groups = [];

    //Check for horizontal matches
    for (let i = 0; i < tileGrid.length; i++)
    {
        let tempArr = tileGrid[i];
        groups = [];
        for (let j = 0; j < tempArr.length; j++)
        {
            if (j < tempArr.length - 2)
                if (tileGrid[i][j] && tileGrid[i][j + 1] && tileGrid[i][j + 2])
                {
                    if (tileGrid[i][j].tileType == tileGrid[i][j+1].tileType && tileGrid[i][j+1].tileType == tileGrid[i][j+2].tileType)
                    {
                        if (groups.length > 0)
                        {
                            if (groups.indexOf(tileGrid[i][j]) == -1)
                            {
                                matches.push(groups);
                                groups = [];
                            }
                        }

                        if (groups.indexOf(tileGrid[i][j]) == -1)
                        {
                            groups.push(tileGrid[i][j]);
                        }
                        if (groups.indexOf(tileGrid[i][j+1]) == -1)
                        {
                            groups.push(tileGrid[i][j+1]);
                        }
                        if (groups.indexOf(tileGrid[i][j+2]) == -1)
                        {
                            groups.push(tileGrid[i][j+2]);
                        }
                    }
                }
        }
        if(groups.length > 0) matches.push(groups);
    }

    //Check for vertical matches
    for (let j = 0; j < tileGrid.length; j++)
    {
        let tempArr = tileGrid[j];
        groups = [];
        for (let i = 0; i < tempArr.length; i++)
        {
            if( i < tempArr.length - 2)
                if (tileGrid[i][j] && tileGrid[i+1][j] && tileGrid[i+2][j])
                {
                    if (tileGrid[i][j].tileType == tileGrid[i+1][j].tileType && tileGrid[i+1][j].tileType == tileGrid[i+2][j].tileType)
                    {
                        if (groups.length > 0)
                        {
                            if (groups.indexOf(tileGrid[i][j]) == -1)
                            {
                                matches.push(groups);
                                groups = [];
                            }
                        }

                        if (groups.indexOf(tileGrid[i][j]) == -1)
                        {
                            groups.push(tileGrid[i][j]);
                        }
                        if (groups.indexOf(tileGrid[i+1][j]) == -1)
                        {
                            groups.push(tileGrid[i+1][j]);
                        }
                        if (groups.indexOf(tileGrid[i+2][j]) == -1)
                        {
                            groups.push(tileGrid[i+2][j]);
                        }
                    }
                }
        }
        if(groups.length > 0) matches.push(groups);
    }

    return matches;

},
removeTileGroup: function(matches) {

    //Loop through all the matches and remove the associated tiles
    for(let i = 0; i < matches.length; i++){
        let tempArr = matches[i];

        for(let j = 0; j < tempArr.length; j++){

            let tile = tempArr[j];
            //Find where this tile lives in the theoretical grid
            let tilePos = this.getTilePos(this.tileGrid, tile);

            //Remove the tile from the screen
            this.tiles.remove(tile);

            //Remove the tile from the theoretical grid
            if (tilePos.x != -1 && tilePos.y != -1){
                this.tileGrid[tilePos.x][tilePos.y] = null;
            }

        }
    }
  },
  getTilePos: function(tileGrid, tile) {
        let pos = {x:-1, y:-1};

        //Find the position of a specific tile in the grid
        for(let i = 0; i < tileGrid.length ; i++)
        {
            for(let j = 0; j < tileGrid[i].length; j++)
            {
                //There is a match at this position so return the grid coords
                if(tile == tileGrid[i][j])
                {
                    pos.x = i;
                    pos.y = j;
                    break;
                }
            }
        }

        return pos;
    },
    resetTile: function(){

      //Loop through each column starting from the left
      for (let i = 0; i < this.tileGrid.length; i++) {

          //Loop through each tile in column from bottom to top
          for (let j = this.tileGrid[i].length - 1; j > 0; j--) {

              //If this space is blank, but the one above it is not, move the one above down
              if(this.tileGrid[i][j] == null && this.tileGrid[i][j-1] != null) {
                  //Move the tile above down one
                  let tempTile = this.tileGrid[i][j-1];
                  this.tileGrid[i][j] = tempTile;
                  this.tileGrid[i][j-1] = null;

                  this.game.add.tween(tempTile).to({
                    y:(this.tileHeight * j) + (this.tileHeight / 2)
                  }, 200, Phaser.Easing.Linear.In, true);

                  //The positions have changed so start this process again from the bottom
                  //NOTE: This is not set to this.tileGrid[i].length - 1 because it will immediately be decremented as
                  //we are at the end of the loop.
                  j = this.tileGrid[i].length;
              }
          }
      }

  },
  fillTile: function() {

    //Check for blank spaces in the grid and add new tiles at that position
    for(let i = 0; i < this.tileGrid.length; i++) {
        for(let j = 0; j < this.tileGrid.length; j++) {
            if (this.tileGrid[i][j] == null) {
                //Found a blank spot so lets add animate a tile there
                let tile = this.addTile(i, j);

                //And also update our "theoretical" grid
                this.tileGrid[i][j] = tile;
            }
        }
    }
  }
};

game.state.add('GameState', GameState);
game.state.start('GameState');
