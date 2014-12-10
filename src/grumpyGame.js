function grumpyGame() {
	// private
	var _game = null;
	var _info = [];

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
		_info.lives = 10;
		_info.numEnemies = 0;
		_info.rndPlatform = [];
		_info.numOfRndPlatforms = 0;
		_info.numKilled = 0;
		_info.sprites = [];
		_info.sounds = [];
		_info.sound = [];
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
			},
			'life': {
				'x': 200,
				'y': 20
			}
		};
		_preloadSprites();
		_preloadSounds();
	};

	var _create = function() {
		_initGame();
		_initSounds();
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
		_moveEnemies();
		_movePlatforms();
		_checkPlayer();
		//_scrollBackground();
	};

	var _preloadSprites = function() {

		_info.sprites = [
			['bg', 'assets/img/bg.png'],
			['pf', 'assets/img/platform.png'],
			['float1', 'assets/img/float1.png'],
			['cat', 'assets/img/cat.png'],
			['enemy_1', 'assets/img/enemy_1.png']
		];

		for (var idx in _info.sprites) {
			//console.log(sprites[idx][0]+ ', ' + sprites[idx][1]);
			_game.load.image(_info.sprites[idx][0], _info.sprites[idx][1]);
		}

	};

	var _preloadSounds = function () {

		_info.sounds = [
			['hurt', ['assets/aud/mp3/hurt.mp3', 'assets/aud/mp3/hurt.ogg']],
			['jump', ['assets/aud/mp3/jump.mp3', 'assets/aud/mp3/jump.ogg']],
			['bg1', ['assets/aud/mp3/bg1.mp3', 'assets/aud/mp3/bg1.ogg']]
		];

		for (var idx in _info.sounds) {
			_game.load.audio(_info.sounds[idx][0], _info.sounds[idx][1]);
		}

	};

	var _initGame = function() {
		_game.physics.startSystem(Phaser.Physics.ARCADE);
		_game.add.sprite(0, 0, 'bg');
	};

	var _initSounds = function() {
		_info.sound = [];
		for(var idx in _info.sounds) {
			_info.sound[_info.sounds[idx][0]] =
				_game.add.audio(_info.sounds[idx][0]);
		}
		for(var idx in _info.sound) {
			console.log(_info.sound[idx]);
		}
		_info.sound['bg1'].play('', 0, 1, true);
	};

	var _addPlatforms = function() {
		_info.platforms = _game.add.group();
		_info.platforms.enableBody = true;
		_info.ground = _info.platforms.create(
			0,
			_game.world.height - 40,
			'pf'
		);
		//_info.ground.scale.setTo(2, 2);
		_info.ground.body.immovable = true;
		_info.rndPlatforms = _game.add.group();
		_info.rndPlatforms.enableBody = true;
	};

	var _rnd = function (min, max) {
		return Math.floor(Math.random() * (max - min) + min);
	};

	var _rndPlatforms = function() {
		var rnd1 = _rnd(_rnd(1, 10), 10);
		for (var i = 0; i < rnd1; ++i) {
			_info.rndPlatform[i] = _info.rndPlatforms.create(
				(i + 1) * (250 + ((_rnd(1, 10) * 100))),
				_game.world.height - (100 + (_rnd(10, 200))),
				'float1'
			);
			_info.rndPlatform[i].body.immovable = true;
			++_info.numOfRndPlatforms;
		}
	};

	var _movePlatforms = function() {
		if(_info.numOfRndPlatforms === 0) {
			_rndPlatforms();
		} else if(_info.numOfRndPlatforms > 0) {
			for(var idx in _info.rndPlatform) {
				if (_info.rndPlatform[idx].x < -_info.rndPlatform[idx].width)
				{
					--_info.numOfRndPlatforms;
					_info.rndPlatform[idx].kill();
					_info.rndPlatform[idx] = [];
				} else {
					_info.rndPlatform[idx].x -= _rnd(0.5, 5);
				}
			}
		}
	};

	var _checkPlayer = function () {
		if((_info.player.y+_info.player.height) > _info.ground.y) {
			_info.player.y -= _info.player.height;
		}
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
			'score: ' + _info.score,
			{
				fontSize: '32px',
				fill: '#FFF'
			}
		);

		_info.roundText = _game.add.text(
			_info.area.round.x,
			_info.area.round.y,
			'round: ' + _info.round,
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

		_info.lifeText = _game.add.text(
			_info.area.life.x,
			_info.area.life.y,
			'lives: ' + _info.lives,
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
			_info.sound['jump'].play();
			p.body.velocity.y = -350;
		}

	};

	var _scrollBackground = function() {
		_info.background.tilePosition.y += 2;
	};

	var _collisions = function() {
		_game.physics.arcade.collide(_info.player, _info.platforms);
		_game.physics.arcade.collide(_info.player, _info.rndPlatforms);
		_game.physics.arcade.collide(_info.enemies, _info.rndPlatforms);
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
		var rnd1 = _rnd(0, enemies.length);
		var groups = [
			'group_1',
			// 'group_2',
			// 'line_1',
		];
		var rnd2 = _rnd(0, groups.length);
		var max = Math.floor((_game.world.width-50) / 50);

		switch(groups[rnd2]) {
			case 'group_1':
				var amount = _rnd(1, 10);
				var count = 1;
				_info.enemy = [];
				for(i = 0; i < amount; ++i) {
					_info.enemy[i] = _info.enemies.create(
						_game.world.width - 150 + (i*50),
						_game.world.height - 200,
						enemies[rnd1]
					);

					_info.enemy[i].body.gravity.y = 100;
					_info.enemy[i].body.bounce.y = 0.7 + Math.random() * 0.2;
					_info.enemy[i].name = 'enemy' + i.toString() + 'x' + count.toString();

					++_info.numEnemies;
				}
			break;
		}

		_info.enemyText.text = 'enemies: ' + _info.numEnemies;
	};

	var _moveEnemies = function() {
		for(var idx in _info.enemy) {
			if(_info.enemy[idx] !== 'undefined') {
				_info.enemy[idx].x -= _rnd(1, 5);
				if (_info.enemy[idx].x < -_info.enemy[idx].width)
				{
					_info.enemy[idx].kill();
					_info.enemy[idx] = [];
					++_info.numKilled;
					_info.enemyText.text = 'enemies: ' + (_info.numEnemies - _info.numKilled);
					if(_info.numKilled === _info.numEnemies) {
						_info.numEnemies = 0;
						_info.numKilled = 0;
						_info.enemy = [];
						_addEnemies();
						_info.roundText.text = 'Round: ' + _info.round;
					}
				}
			}
		}
	};

	var _killEnemy = function(p, e) {
		if((_info.player.x + _info.player.height) === e.y) {
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
				_info.enemy = [];
			}
		} else {
			_info.sound['hurt'].play();
			_info.lives -= 1;
			_info.player.y = 100;
			_info.lifeText.text = 'lives: ' + _info.lives;
		}
	};
};

var gg = new grumpyGame();
gg.construct();
