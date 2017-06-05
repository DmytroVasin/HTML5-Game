var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'game', { preload: preload, create: create, update: update, render:render });

function preload() {
  game.load.tilemap('map', './new-assets/map.json', null, Phaser.Tilemap.TILED_JSON);

  game.load.image('diamond', './tiles/diamond.png');
  game.load.image('wall', './tiles/ground_1x1.png');
  game.load.image('triangle', './tiles/triangle.png');
  game.load.image('coin', './sprites/coin.png');
  game.load.image('background', './sprites/background.png');
  game.load.image('ball', './sprites/ball.png');
  game.load.image('firstaid', './sprites/firstaid.png');
}

var map;
var layer;
var sprite;
var cursors;
var background;
var ball;
var score = 0;
var scoreCaption;
var triangle;

function hitNeedleCallback(ball, coin, ball_fixture, coin_fixture, begin) {
  if (!begin) { return; }

  ball.sprite.destroy()
}

function createTriangle(x, y) {
  triangle = game.add.sprite(x, y, 'triangle');
  game.physics.box2d.enable(triangle);
  triangle.body.clearFixtures();
  triangle.body.setPolygon([0,0, 0, -30, 30,0]);
  triangle.anchor.setTo(0,1);
  triangle.body.static = true;
  triangle.body.angle = -90;
}

function create() {
  game.physics.startSystem(Phaser.Physics.BOX2D);

  game.physics.box2d.gravity.y = 500;

  background = game.add.tileSprite(0, 0, 800, 600, 'background');
  background.fixedToCamera = true;

  ball = game.add.sprite(256, 64, 'ball'); // Position

  game.physics.box2d.enable(ball);
  ball.body.setCircle(ball.width / 2);
  ball.body.restitution = 0.3;

  map = game.add.tilemap('map');
  map.addTilesetImage('wall');
  map.addTilesetImage('coin');
  map.addTilesetImage('diamond');

  map.setCollisionBetween(1, 25);

  layer = map.createLayer('Map Layer');

  //  Convert the tilemap layer into bodies. Only tiles that collide (see above) are created.
  //  This call returns an array of body objects which you can perform addition actions on if
  //  required. There is also a parameter to control optimising the map build.
  game.physics.box2d.convertTilemap(map, layer);

  layer.resizeWorld();

  //  By default the ship will collide with the World bounds,
  //  however because you have changed the size of the world (via layer.resizeWorld) to match the tilemap
  //  you need to rebuild the physics world boundary as well. The following
  //  line does that. The first 4 parameters control if you need a boundary on the left, right, top and bottom of your world.
  //  The final parameter (false) controls if the boundary should use its own collision group or not. In this case we don't require
  //  that, so it's set to false. But if you had custom collision groups set-up then you would need this set to true.
  game.physics.box2d.setBoundsToWorld(true, true, true, true, false);



  createTriangle(447, 351)


  var coins = game.add.group();
  coins.enableBody = true;
  coins.physicsBodyType = Phaser.Physics.BOX2D;

  for (var i = 0; i < 2; i++) {
    var sprite = coins.create(100 * (i+1), 200, 'firstaid');
    sprite.body.setCollisionCategory(26); // this is a bitmask
    sprite.body.gravityScale = false;
    sprite.body.sensor = true;
  }

  for (var i = 0; i < 1; i++) {
    var sprite = coins.create(150 * (i+1), 230, 'diamond');
    sprite.body.setCollisionCategory(27); // this is a bitmask
    sprite.body.gravityScale = false;
    // sprite.body.sensor = true;
  }

  ball.body.setCategoryContactCallback(26, getCoinCallback, this);
  ball.body.setCategoryContactCallback(27, hitNeedleCallback, this);

  game.camera.follow(ball);

  cursors = game.input.keyboard.createCursorKeys();

  scoreCaption = game.add.text(5, 5, 'Score: ' + score, { fill: '#ffffff', font: '14pt Arial' });

  game.input.onDown.add(mouseDragStart, this);
  game.input.addMoveCallback(mouseDragMove, this);
  game.input.onUp.add(mouseDragEnd, this);
}

function update() {
  if (cursors.up.isDown) {
    if (ball.body.velocity.y == 0) {
      ball.body.velocity.y = -510
    }
  }

  if (cursors.left.isDown) {
    ball.body.velocity.x = -250;
  }
  if (cursors.right.isDown) {
    ball.body.velocity.x = 250;
  }
}

function render() {
  // // Useful debug things you can turn on to see what's happening
  // game.debug.spriteBounds(triangle);
  // game.debug.cameraInfo(ball, 32, 32);
  // game.debug.bodyInfo(triangle, 32, 32);
  // game.debug.body(triangle);
  // game.debug.box2dWorld();
}

function getCoinCallback(ball, coin, ball_fixture, coin_fixture, begin) {
  // This callback is also called for EndContact events, which we are not interested in.
  if (!begin) { return; }

  increaseScore();
  coin.sprite.destroy();
}


function increaseScore() {
  score += 1;
  scoreCaption.text = 'Score: ' + score;
}


function mouseDragStart() {
    game.physics.box2d.mouseDragStart(game.input.mousePointer);
}

function mouseDragMove() {
    game.physics.box2d.mouseDragMove(game.input.mousePointer);
}

function mouseDragEnd() {
    game.physics.box2d.mouseDragEnd();
}
