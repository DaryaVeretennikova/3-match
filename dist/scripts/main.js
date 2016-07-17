var GEM_SIZE = 32;
var GEM_SPACING = 2;
var GEM_SIZE_SPACED = GEM_SIZE + GEM_SPACING;
var BOARD_COLS;
var BOARD_ROWS;

var game = new Phaser.Game(640, 640, Phaser.AUTO);

var GameState = {
  preload: function() {
    this.game.load.image('blue', 'assets/images/gems/blue.png');
    this.game.load.image('green', 'assets/images/gems/green.png');
    this.game.load.image('purple', 'assets/images/gems/purple.png');
    this.game.load.image('red', 'assets/images/gems/red.png');
    this.game.load.image('sky-blue', 'assets/images/gems/sky-blue.png');
  },
  create: function() {
    this.game.stage.backgroundColor = '#ebebeb';

    this.tyleTypes = [
      'blue',
      'green',
      'purple',
      'red',
      'sky-blue'
    ];

    this.score = 0;

    this.activeTile1 = null;
    this.activeTile2 = null;

    this.canMove = false;

    this.tiles = this.game.add.group();

    this.tileGrid = [
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null]
    ];
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

  addTile: function() {
    
  }
};

game.state.add('GameState', GameState);
game.state.start('GameState');
