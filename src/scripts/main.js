const game = new Phaser.Game(640, 640, Phaser.AUTO);

const GameState = {
  preload: function() {

  },
  create: function() {

  },
  update: function() {

  }
};

game.state.add('GameState', GameState);
game.state.start('GameState');
