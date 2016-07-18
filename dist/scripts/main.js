var GEM_SIZE = 32;
var GEM_SPACING = 2;
var GEM_SIZE_SPACED = GEM_SIZE + GEM_SPACING;
var BOARD_COLS;
var BOARD_ROWS;

var game = new Phaser.Game(500, 500, Phaser.AUTO);

var GameState = {
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

  },

  initTiles: function() {
    var this$1 = this;

    var tileGridLength = this.tileGrid.length;

    for (var i = 0; i < tileGridLength; i++) {
      for (var j = 0; j < tileGridLength; j++) {
        var tile = this$1.addTile(i, j);

        this$1.tileGrid[i][j] = tile;
      }
    }

    //Once the tiles are ready, check for any matches on the grid
    // this.game.time.events.add(600, function(){
    //     this.checkMatch();
    // });
  },

  addTile: function(x, y) {
    var tileToAdd = this.tileTypes[this.random.integerInRange(0, this.tileTypes.length - 1)];
    var tile = this.tiles.create((x * this.tileWidth) + this.tileWidth / 2, 0, tileToAdd);

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

  tileDown: function(tile, pointer){

    //Keep track of where the user originally clicked
    if(this.canMove){
        this.activeTile1 = tile;

        this.startPosX = (tile.x - this.tileWidth / 2) / this.tileWidth;
        this.startPosY = (tile.y - this.tileHeight / 2) / this.tileHeight;
    }

  }
};

game.state.add('GameState', GameState);
game.state.start('GameState');
