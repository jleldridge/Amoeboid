class Engine {
    constructor(width, height) {
        this.width = width;
        this.height = height;

        this.MIN_PLAYER_SIZE = 20;
        this.MAX_PLAYER_SIZE = 100;
        this.MAX_PLAYER_SPEED = 200;
        this.MAX_ENEMIES = 20;
        this.MIN_ENEMY_SIZE = 10;
        this.MAX_ENEMY_SIZE = 95;
        this.MIN_ENEMY_SPEED = 50;
        this.MAX_ENEMY_SPEED = 200;
        this.KEY_CODES = { 'w': 87, 'a': 65, 's': 83, 'd': 68 };
        this.POWERUP_SPAWN_CHANCE = 0.05;
        this.POWERUP_TYPES = ['eat everything'];

        this.keys = { 'w': false, 'a': false, 's': false, 'd': false, 'mouse': null };

        window.addEventListener('keydown', (event) => { this.keyDown(event); });
        window.addEventListener('keyup', (event) => { this.keyUp(event); });
        window.addEventListener("mousedown", (event) => { this.mouseDown(event); });
        window.addEventListener("mouseup", (event) => { this.mouseUp(event); });

        this.initGameState();
    }

    initGameState() {
        this.enemies = [];
        this.powerups = [];
        this.player = new Player(this.width / 2, this.height / 2, this.MIN_PLAYER_SIZE);
        this.isPaused = false;
        this.wasPaused = false;
        this.gameOver = false;
    }

    keyDown(event) {
        if (this.gameOver) {
            this.initGameState();
            return;
        }

        switch (event.key) {
            case "w":
                this.keys.w = true;
                break;
            case "a":
                this.keys.a = true;
                break;
            case "s":
                this.keys.s = true;
                break;
            case "d":
                this.keys.d = true;
                break;
            case "r":
                this.createExtraLife();
                break;
            case " ":
                this.isPaused = !this.isPaused;
                if (!this.isPaused) {
                    this.wasPaused = true;
                }
        }
    }

    keyUp(event) {
        switch (event.key) {
            case "w":
                this.keys.w = false;
                break;
            case "a":
                this.keys.a = false;
                break;
            case "s":
                this.keys.s = false;
                break;
            case "d":
                this.keys.d = false;
                break;
        }
    }

    mouseDown(event) {
        this.keys.mouse = { 'x': event.clientX, 'y': event.clientY};
    }

    mouseUp(event) {
        this.keys.mouse = null;
    }

    createExtraLife() {
        if (this.player.size - this.MIN_PLAYER_SIZE >= 10) {
            this.player.lives += 1;
            this.player.size -= Math.max(Math.floor((this.player.size - this.MIN_PLAYER_SIZE) / 2), 10);
        }
    }

    deleteOffScreenEnemies() {
        for (var i = this.enemies.length - 1; i >= 0; i--) {
            var enemy = this.enemies[i];
            if (enemy.x + enemy.size / 2 < 0
                || enemy.x - enemy.size / 2 > this.width
                || enemy.y + enemy.size / 2 < 0
                || enemy.y - enemy.size / 2 > this.height) {
                this.enemies.splice(i, 1);
            }
        }
    }

    generateNewEnemies() {
        if (this.enemies.length < this.MAX_ENEMIES) {
            var generateEnemy = Math.random() > 0.9;
            if (generateEnemy) {
                var speed = (Math.random() * (this.MAX_ENEMY_SPEED - this.MIN_ENEMY_SPEED)) + this.MIN_ENEMY_SPEED;
                var size = Math.floor(Math.random() * (this.MAX_ENEMY_SIZE - this.MIN_ENEMY_SIZE)) + this.MIN_ENEMY_SIZE;
                // randomly determine spawn side
                var side = size % 4;
                var x = 0;
                var y = 0;
                var dx = 0;
                var dy = 0;
                switch (side) {
                    // from left
                    case 0:
                        y = Math.random() * this.height;
                        dx = speed;
                        break;
                    // from top
                    case 1:
                        x = Math.random() * this.width;
                        dy = speed;
                        break;
                    // from right
                    case 2:
                        x = this.width;
                        y = Math.random() * this.height;
                        dx = -1 * speed;
                        break;
                    // from bottom
                    case 3:
                        x = Math.random() * this.width;
                        y = this.height;
                        dy = -1 * speed;
                        break;
                }

                var enemy = {
                    'size': size,
                    'x': x,
                    'y': y,
                    'dx': dx,
                    'dy': dy
                };

                this.enemies.push(enemy);
            }
        }
    }

    generatePowerups(delta) {
        var x = this.POWERUP_SPAWN_CHANCE * delta;
        if (Math.random() <= x) {
            // spawn powerup
            var type = this.POWERUP_TYPES[Math.floor(MathHelper.random(0, this.POWERUP_TYPES.length))];
            var x = MathHelper.random(0, this.width);
            var y = MathHelper.random(0, this.height);
            this.powerups.push(new Powerup(type, x, y, 5));
        }
    }

    moveEnemies(delta) {
        for (var i = 0; i < this.enemies.length; i++) {
            var enemy = this.enemies[i];
            enemy.x += enemy.dx * delta;
            enemy.y += enemy.dy * delta;
        }
    }

    movePlayer(delta) {
        var increaseRate = 500 * delta;
        var decayRate = delta * 50;

        if (this.keys.w && !this.keys.s) {
            this.player.dy = Math.max(-1 * this.MAX_PLAYER_SPEED, this.player.dy + increaseRate * -1);
        }
        else if (!this.keys.w && this.keys.s) {
            this.player.dy = Math.min(this.MAX_PLAYER_SPEED, this.player.dy + increaseRate);
        }
        else if (this.player.dy > 0) {
            this.player.dy = Math.max(0, this.player.dy - decayRate);
        }
        else if (this.player.dy < 0) {
            this.player.dy = Math.min(0, this.player.dy + decayRate);
        }

        if (this.keys.a && !this.keys.d) {
            this.player.dx = Math.max(-1 * this.MAX_PLAYER_SPEED, this.player.dx + increaseRate * -1);
        }
        else if (!this.keys.a && this.keys.d) {
            this.player.dx = Math.min(this.MAX_PLAYER_SPEED, this.player.dx + increaseRate);
        }
        else if (this.player.dx > 0) {
            this.player.dx = Math.max(0, this.player.dx - decayRate);
        }
        else if (this.player.dx < 0) {
            this.player.dx = Math.min(0, this.player.dx + decayRate);
        }

        // if (this.keys.mouse != null) {
        //     var moveVector = {
        //         'x': this.keys.mouse.x - this.player.x,
        //         'y': this.keys.mouse.y - this.player.y
        //     };
        //     var distance = MathHelper.distance(this.keys.mouse.x, this.keys.mouse.y, this.player.x, this.player.y);
        //     var normalVector = {
        //         'x': moveVector.x / distance,
        //         'y': moveVector.y / distance
        //     };

        //     this.player.dx = Math.min(this.MAX_PLAYER_SPEED, this.player.dx + increaseRate * normalVector.x);
        //     this.player.dy = Math.min(this.MAX_PLAYER_SPEED, this.player.dy + increaseRate * normalVector.y);
        // }

        this.player.x += this.player.dx * delta;
        this.player.y += this.player.dy * delta;

        if (this.player.x - this.player.size / 2 > this.width
            || this.player.x + this.player.size / 2 < 0) {
            this.player.x -= this.player.dx * delta;
        }
        if (this.player.y - this.player.size / 2 > this.height
            || this.player.y + this.player.size / 2 < 0) {
            this.player.y -= this.player.dy * delta;
        }
    }

    handleCollisions() {
        for (var i = this.enemies.length - 1; i >= 0; i--) {
            var enemy = this.enemies[i];
            var distance = MathHelper.distance(this.player.x, this.player.y, enemy.x, enemy.y);

            // slightly bigger eating size
            if (distance < (enemy.size / 2) + (this.player.size / 2) + 2) {
                if ((this.currentPowerup && this.currentPowerup.type == 'eat everything') || this.player.size > enemy.size) {
                    this.enemies.splice(i, 1);
                    this.player.size += 1;
                    continue;
                }
            }
            // slightly lower game over size
            if (!this.player.invulnerable && distance < (enemy.size / 2) + (this.player.size / 2) - 3) {
                if (this.player.size <= enemy.size) {
                    this.player.lives--;
                    if (this.player.lives <= 0) {
                        this.gameOver = true;
                    }
                    else {
                        this.player.invulnerable = true;
                        this.invulnerableTimer = 3;
                    }
                }
            }
        }

        for (var i = this.powerups.length - 1; i >= 0; i--) {
            var powerup = this.powerups[i];
            var distance = MathHelper.distance(this.player.x, this.player.y, powerup.x, powerup.y);

            if (distance < (powerup.size / 2) + (this.player.size / 2) + 2) {
                this.currentPowerup = this.powerups[i];
                this.powerups.splice(i, 1);
            }
        }

        // if (this.currentPowerup && this.currentPowerup.type == 'clear screen') {
        //     this.enemies.splice(0, this.enemies.length);
        //     this.currentPowerup = null;
        // }
    }

    update(delta) {
        if (!this.gameOver && !this.isPaused) {
            if (this.wasPaused) {
                delta = 0;
                this.wasPaused = false;
            }

            if (this.player.invulnerable && this.invulnerableTimer > 0) {
                this.invulnerableTimer -= delta;
            }
            else if (this.player.invulnerable) {
                this.invulnerableTimer = 0;
                this.player.invulnerable = false;
            }

            if (this.currentPowerup) {
                this.currentPowerup.time -= delta;

                if (this.currentPowerup.time <= 0) {
                    this.currentPowerup = null;
                }
            }

            this.moveEnemies(delta);
            this.movePlayer(delta);
            this.deleteOffScreenEnemies();
            this.handleCollisions();
            this.generateNewEnemies();
            this.generatePowerups(delta);
        }
    }
}