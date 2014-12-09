function grumpyGame() {
	// private
	var _game = null;
	var _info = new Array();

	// public functions
	this.construct = function() {
		_game = new Phaser.Game(
			1024,
			768,
			Phaser.AUTO,
			'',
			{
				preload: _preload,
				create: _create,
				update: _update
			}
		);
	};

	// private functions
	var _preload = function() {
		_info.score = 0;
		_info.round = 0;
		_info.numEnemies = 0;
		_info.numKilled = 0;
		_info.area = {
			'score': {
				'x': 20,
				'y': 20
			},
			'round': {
				'x': _game.world.width -150,
				'y': 20
			},
			'enemy': {
				'x': _game.world.width/2,
				'y': 20
			}
		};
		_preloadSprites();
	};

	var _create = function() {
		_initGame();
		_addPlatforms();
		_addPlayer();
		_setupPlayer();
		_addTextGui();
		_setupEnemies();
		_addEnemies();
		//_setupBackground();
	};

	var _update = function () {
		_collisions();
		_keyboardActions();
		//_scrollBackground();
	};

	var _preloadSprites = function() {

		var sprites = [
			['bg', 'assets/img/bg.png'],
			['pf', 'assets/img/platform.png'],
			['cat', 'assets/img/cat.png'],
			['enemy_1', 'assets/img/enemy_1.png']
		];

		for (var idx in sprites) {
			//console.log(sprites[idx][0]+ ', ' + sprites[idx][1]);
			_game.load.image(sprites[idx][0], sprites[idx][1]);
		}

	};

	var _initGame = function() {
		_game.physics.startSystem(Phaser.Physics.ARCADE);
		_game.add.sprite(0, 0, 'bg');
	};

	var _addPlatforms = function() {
		_info.platforms = _game.add.group();
		_info.platforms.enableBody = true;
		_info.ground = _info.platforms.create(
			0,
			_game.world.height - 40,
			'pf'
		);
		_info.ground.scale.setTo(2, 2);
		_info.ground.body.immovable = true;
	};

	var _addPlayer = function() {

			_info.player = _game.add.sprite(
				32,
				_game.world.height - 150,
				'cat'
			);

	};

	var _setupPlayer = function() {

			_game.physics.arcade.enable(_info.player);
			_info.player.body.bounce.y = 0.2;
			_info.player.body.gravity.y = 300;
			_info.player.body.collideWorldBounds = true;

			// add(name, frames, frameRate, loop, useNumericIndex)
			// add('left', [0, 1, 2, 3], 10, true);
			_info.player.animations.add('left', [0, 1, 2, 3], 10, true);
			_info.player.animations.add('right', [0, 1, 2, 3], 10, true);

			// Creates and returns an object containing
			// 4 hotkeys for Up, Down, Left and Right.
			_info.cursors = _game.input.keyboard.createCursorKeys();

	};

	var _setupBackground = function() {
		_info.background = _game.add.tileSprite(0, 0, 1024, 768, 'bg');
	};

	var _addTextGui = function() {

		_info.scoreText = _game.add.text(
			_info.area.score.x,
			_info.area.score.y,
			'score: 0',
			{
				fontSize: '32px',
				fill: '#FFF'
			}
		);

		_info.roundText = _game.add.text(
			_info.area.round.x,
			_info.area.round.y,
			'round: 0',
			{
				fontSize: '32px',
				fill: '#FFF'
			}
		);

		_info.enemyText = _game.add.text(
			_info.area.enemy.x,
			_info.area.enemy.y,
			'enemies: 0',
			{
				fontSize: '32px',
				fill: '#FFF'
			}
		);

	};

	var _keyboardActions = function() {
		var c = _info.cursors;
		var p = _info.player;

		if(c.left.isDown) {
			p.body.velocity.x = -150;
			p.animations.play('left');
		} else if(c.right.isDown) {
			p.body.velocity.x = 150;
			p.animations.play('right');
		} else {
			p.animations.stop();
			p.frame = 4;
		}

		if(c.up.isDown && p.body.touching.down) {
			p.body.velocity.y = -350;
		}

	};

	var _scrollBackground = function() {
		_info.background.tilePosition.y += 2;
	};

	var _collisions = function() {
		_game.physics.arcade.collide(_info.player, _info.platforms);
		_game.physics.arcade.collide(_info.enemies, _info.platforms);
		_game.physics.arcade.overlap(
			_info.player,
			_info.enemies,
			_killEnemy,
			null,
			this
		);
	};

	var _setupEnemies = function() {
		_info.enemies = _game.add.group();
		_info.enemies.enableBody = true;
	};

	var _addEnemies = function() {
		// Enemy number one
		var enemies = ['enemy_1'];
		var rnd1 = Math.floor(Math.random() * (enemies.length - 0) + 0);
		var groups = [
			'group_1',
			'group_2',
			'line_1',
		];
		var rnd2 = Math.floor(Math.random() * (groups.length - 0) + 0);
		var max = Math.floor((_game.world.width-50) / 50);

		switch(groups[rnd2]) {
			case 'group_1':
				var amount = 10;
				var count = 1;
				for(i = 0; i < amount; ++i) {
					var enemy;
					if(i < (amount/2)) {
						enemy = _info.enemies.create(
							count*50,
							50,
							enemies[rnd1]
						);
					} else {
						enemy = _info.enemies.create(
							count*50,
							100,
							enemies[rnd1]
						);
					}

					enemy.body.gravity.y = 100;
					enemy.body.bounce.y = 0.7 + Math.random() * 0.2;
					enemy.name = 'enemy' + i.toString() + 'x' + count.toString();

					if(i === (amount/2)) {
						count = 1;
					} else { ++count; }

					++_info.numEnemies;
				}
			break;
			case 'group_2':
				var amount = 10;
				var count = 1;
				for(i = 0; i < amount; ++i) {
					var enemy;
					if(i < (amount/2)) {
						enemy = _info.enemies.create(
							(_game.world.width - (amount*50))+count*50,
							50,
							enemies[rnd1]
						);
					} else {
						enemy = _info.enemies.create(
							(_game.world.width - (amount*50))+count*50,
							100,
							enemies[rnd1]
						);
					}

					enemy.body.gravity.y = 100;
					enemy.body.bounce.y = 0.7 + Math.random() * 0.2;

					if(i === (amount/2)) {
						count = 1;
					} else { ++count; }

						++_info.numEnemies;
					}
				break;
				case 'line_1':
					var amount = 10;
					for(i = 0; i < amount; ++i) {
						var enemy;
						enemy = _info.enemies.create(
							i*50,
							100,
							enemies[rnd1]
						);

						enemy.body.gravity.y = 100;
						enemy.body.bounce.y = 0.7 + Math.random() * 0.2;

						++_info.numEnemies;
					}
				break;
		}

		_info.enemyText.text = 'enemies: ' + _info.numEnemies;
	};

	var _killEnemy = function(p, e) {
		e.kill();
		_info.score += 10;
		_info.scoreText.text = 'score: ' + _info.score;
		++_info.numKilled;
		_info.enemyText.text = 'enemies: ' + (_info.numEnemies - _info.numKilled);

		if(_info.numKilled === _info.numEnemies) {
			++_info.round;
			_info.numEnemies = 0;
			_info.numKilled = 0;
			_addEnemies();
			_info.roundText.text = 'Round: ' + _info.round;
		}

	};
};

var gg = new grumpyGame();
gg.construct();
