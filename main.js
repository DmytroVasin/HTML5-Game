var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update, render:render });

function preload() {
  game.load.tilemap('map', './new-assets/map.json', null, Phaser.Tilemap.TILED_JSON);

  game.load.image('wall', './tiles/ground_1x1.png');
  game.load.image('coin', './sprites/coin.png');
  game.load.image('background', './sprites/background.png');
  game.load.image('bullet', './sprites/bullet.png');

  game.load.spritesheet('dude', './sprites/dude.png', 32, 48);  // key, sourcefile, framesize x, framesize y
}

var map;
var layer;
var sprite;
var cursors;
var facing = 'turn';
var background;
var weapon;
var fireButton;


function hitCoin(sprite, tile) {
  tile.alpha = 0.2;
  layer.dirty = true;
  return false;
}

function create() {
    //  Creates 30 bullets, using the 'bullet' graphic
    weapon = game.add.weapon(30, 'bullet');
    //  The bullets will be automatically killed when they are 2000ms old
    weapon.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
    weapon.bulletLifespan = 2000;
    //  The speed at which the bullet is fired
    weapon.bulletSpeed = 600;
    //  Speed-up the rate of fire, allowing them to shoot 1 bullet every 60ms
    weapon.fireRate = 100;






  game.physics.startSystem(Phaser.Physics.ARCADE);

  background = game.add.tileSprite(0, 0, 800, 600, 'background');
  background.fixedToCamera = true;

  map = game.add.tilemap('map');
  layer = map.createLayer('Map Layer');
  layer.resizeWorld();


  map.addTilesetImage('wall');
  map.addTilesetImage('coin');

  map.setCollisionBetween(1, 25);

  map.setTileIndexCallback(26, hitCoin, this); //  This will set Tile ID 26 (the coin) to call the hitCoin function when collided with

  sprite = game.add.sprite(256, 64, 'dude'); // Position
  game.physics.enable(sprite);
  sprite.body.linearDamping = 1;

  sprite.body.bounce.set(0, 0);
  sprite.body.setSize(20, 32, 5, 16); // width, height, offsetX, offsetY

  sprite.animations.add('left', [0, 1, 2, 3], 10, true); // (key, framesarray, fps,repeat)
  sprite.animations.add('right', [5, 6, 7, 8], 10, true);
  sprite.frame = 4; // Start frame



    //  Tell the Weapon to track the 'player' Sprite
    //  With no offsets from the position
    //  But the 'true' argument tells the weapon to track sprite rotation
    weapon.trackSprite(sprite, 14, 0);


  game.camera.follow(sprite);
  game.physics.arcade.gravity.y = 700;

  cursors = game.input.keyboard.createCursorKeys();
  fireButton = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
}

function update() {
  game.physics.arcade.collide(sprite, layer);

  sprite.body.velocity.x = 0;

  if (cursors.up.isDown) {
    if (sprite.body.onFloor()) {
      sprite.body.velocity.y = -510
    }
  }

  if (cursors.left.isDown) {
    sprite.body.velocity.x = -250;

    if (facing != 'left') {
      sprite.animations.play('left');
      facing = 'left'
    }
  }
  else if (cursors.right.isDown) {
    sprite.body.velocity.x = 250;

    if (facing != 'right') {
      sprite.animations.play('right');
      facing = 'right'
    }
  }
  else {
    if (facing != 'turn') {
      sprite.animations.stop();

      if (facing == 'left') {
        sprite.frame = 0;
      } else {
        sprite.frame = 5;
      }

      facing = 'turn';
    }
  }

  if (fireButton.isDown) {
    weapon.fire();
  }
}

function render() {
  // Useful debug things you can turn on to see what's happening
  // game.debug.spriteBounds(sprite);
  // game.debug.cameraInfo(game.camera, 32, 32);
  // game.debug.bodyInfo(sprite, 32, 32);
  // game.debug.body(sprite);
  weapon.debug();
}
