(function(){

    var game = {
        onReady: function() {
            // var wrapper = document.getElementById('game-screen');

            opus.assetmanager.loadImage('Grass', './js/resources/grass.png');
            opus.assetmanager.loadImage('MainTileSet', './js/resources/mainTileSet.png');
            opus.assetmanager.loadJSON('Map', './js/resources/testmap.json');

            setTimeout(function() {
                opus.renderer.init(800,800);
                opus.LevelManager.init();

                opus.game.gameWorld.addElement(new game.Player(300, 100, 16, 16, 'Player'), 3);

                opus.gamestate.setGameState(opus.gamestate.PLAY, new game.PlayScreen());
                opus.gamestate.changeGameState(opus.gamestate.PLAY);
            }, 1000);
        }
    };

    game.PlayScreen = opus.gamescreen.extend({
        onReset: function() {
            opus.input.bindKey(opus.input.KEY.W, "forward");
            opus.input.bindKey(opus.input.KEY.A, "left");
            opus.input.bindKey(opus.input.KEY.S, "down");
            opus.input.bindKey(opus.input.KEY.D, "right");
        }
    });

    game.Player = opus.Entity.extend({
        init: function(x, y, width, height, name) {
            this._super(opus.Entity, "init", [x, y, width, height, name]);

            this.body.acceleration.set(1,1);
            this.body.maxVelocity.set(1,1);
            this.lastTime = opus.timer.getTimeElapsed();
            this.lastPosition = new opus.vector2d();
            this.lastPosition.x = this.position.x;
            this.lastPosition.y = this.position.y;
        },

        update: function(time) {
            this._super(opus.Entity, "update", [time]);

            this.isColliding = false;
            var container = opus.game.gameWorld.containedElements;

            for (var e in container) {
                if (container[e].type == "collision") {
                    var obj = container[e];

                    if (this.position.x < obj.position.x + obj.width &&
                        this.position.x + this.width > obj.position.x &&
                        this.position.y < obj.position.y + obj.height &&
                        this.position.y + this.height > obj.position.y) {
                        this.isColliding = true;
                    }
                }
            }

            if (this.isColliding === false) {
                this.oldPosition = {
                    x: this.position.x,
                    y: this.position.y
                };

                if ((opus.timer.getTimeElapsed() - this.lastTime) >= 1) {
                    console.log(this.position.subtract(this.lastPosition));
                    this.lastTime = opus.timer.getTimeElapsed();
                    this.lastPosition.x = this.position.x;
                    this.lastPosition.y = this.position.y;
                }

                if (opus.input.isKeyPressed("forward")) {
                    if (this.position.y > opus.game.gameWorld.position.y)
                        this.body.velocity.y -= this.body.acceleration.y * opus.timer.tick;
                } else if (opus.input.isKeyPressed("down")) {
                    if (this.position.y < opus.game.gameWorld.height - this.height)
                        this.body.velocity.y += this.body.acceleration.y * opus.timer.tick;
                } else {
                    this.body.velocity.y = 0;
                }

                if (opus.input.isKeyPressed("left")) {
                    if (this.position.x > opus.game.gameWorld.position.x)
                        this.body.velocity.x -= this.body.acceleration.x * opus.timer.tick;
                } else if (opus.input.isKeyPressed("right")) {
                    if (this.position.x < opus.game.gameWorld.width - this.width)
                        this.body.velocity.x += this.body.acceleration.x * opus.timer.tick;
                } else {
                    this.body.velocity.x = 0;
                }



            } else {
                this.position.y = this.oldPosition.y;
                this.position.x = this.oldPosition.x;
            }

            this.body.update(time);
        }
    });

    game.onReady();
})();