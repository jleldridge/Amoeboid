class Renderer {
    constructor(container, width, height) {
        this._background = document.createElement('canvas');
        this._foreground = document.createElement('canvas');
        this._overlay = document.createElement('canvas');

        container.appendChild(this._background);
        container.appendChild(this._foreground);
        container.appendChild(this._overlay);

        this._background.style.zIndex = 0;
        this._foreground.style.zIndex = 1;
        this._overlay.style.zIndex = 2;

        this._background.style.position = 'absolute';
        this._background.style.top = 0;
        this._background.style.left = 0;
        this._background.width = width;
        this._background.height = height;
        this._background.style.backgroundColor = 'black';

        this._foreground.style.position = 'absolute';
        this._foreground.style.top = 0;
        this._foreground.style.left = 0;
        this._foreground.width = width;
        this._foreground.height = height;
        this._foreground.style.backgroundColor = 'transparent';

        this._overlay.style.position = 'absolute';
        this._overlay.style.top = 0;
        this._overlay.style.left = 0;
        this._overlay.width = width;
        this._overlay.height = height;
        this._overlay.style.backgroundColor = 'transparent';

        this._backgroundCtx = this._background.getContext('2d');
        this._foregroundCtx = this._foreground.getContext('2d');
        this._overlayCtx = this._overlay.getContext('2d');
    }

    render(engine, delta) {
        if (!engine.isPaused && !engine.gameOver) {
            this._foregroundCtx.clearRect(0, 0, this._foreground.width, this._foreground.height);
            this._overlayCtx.clearRect(0, 0, this._overlay.width, this._overlay.height);

            this.renderPlayer(engine.player, delta);
            this.renderEnemies(engine.enemies, engine.currentPowerup, delta);
            this.renderPowerups(engine.powerups, delta);
            this.renderOverlay(engine, delta);
        }
        else if (engine.isPaused) {
            this._overlayCtx.fillStyle = 'white';
            this._overlayCtx.font = '50px Arial';
            this._overlayCtx.strokeStyle = 'black';
            var x = (this._overlay.width / 2) - (("PAUSED".length * 40) / 2);
            this._overlayCtx.fillText("PAUSED", x, this._overlay.height / 2);
            this._overlayCtx.strokeText("PAUSED", x, this._overlay.height / 2);
        }
        else if (engine.gameOver) {
            this._overlayCtx.fillStyle = 'white';
            this._overlayCtx.font = '50px Arial';
            this._overlayCtx.strokeStyle = 'black';
            var x = (this._overlay.width / 2) - (("GAME OVER".length * 40) / 2);
            this._overlayCtx.fillText("GAME OVER", x, this._overlay.height / 2);
            this._overlayCtx.strokeText("GAME OVER", x, this._overlay.height / 2);
        }
    }

    renderPowerups(powerups, delta) {
        this._foregroundCtx.fillStyle = 'blue';
        for (var i = 0; i < powerups.length; i++) {
            var powerup = powerups[i];
            this._foregroundCtx.beginPath();
            this._foregroundCtx.arc(powerup.x, powerup.y, powerup.size / 2, 0, 2 * Math.PI, false);
            this._foregroundCtx.fill();
        }
        this._foregroundCtx.closePath();
    }
    
    renderEnemies(enemies, currentPowerup, delta) {
        if (currentPowerup && currentPowerup.type == "eat everything") {
            if (currentPowerup.time > 1) {
                this._foregroundCtx.fillStyle = 'yellow';
            }
            else {
                this._foregroundCtx.fillStyle = 'orange';
            }
        }
        else {
            this._foregroundCtx.fillStyle = 'red';
        }
        for (var i = 0; i < enemies.length; i++) {
            var enemy = enemies[i];
            this._foregroundCtx.beginPath();
            this._foregroundCtx.arc(enemy.x, enemy.y, enemy.size / 2, 0, 2 * Math.PI, false);
            this._foregroundCtx.fill();
        }
        this._foregroundCtx.closePath();
    }

    renderPlayer(player, delta) {
        if (player.invulnerable) {
            this._foregroundCtx.fillStyle = 'purple';
        }
        else {
            this._foregroundCtx.fillStyle = 'green';
        }
        this._foregroundCtx.beginPath();
        this._foregroundCtx.arc(player.x, player.y, player.size / 2, 0, 2 * Math.PI, false);
        this._foregroundCtx.fill();
        this._foregroundCtx.closePath();
    }

    renderOverlay(engine, delta) {
        this._overlayCtx.fillStyle = 'white';
        this._overlayCtx.font = '25px Arial';
        var livesString = "Lives: " + engine.player.lives;
        this._overlayCtx.fillText(livesString, this._overlay.width - livesString.length * 20, 40);
        var sizeString = "Score: " + (engine.player.size - engine.MIN_PLAYER_SIZE);
        this._overlayCtx.fillText(sizeString, this._overlay.width - livesString.length * 20, 65);
    }
}