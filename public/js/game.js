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
        },

        update: function(deltaTime) {
            this._super(opus.Entity, "update", [deltaTime]);

            if (opus.input.isKeyPressed("forward")) {
                if (this.position.y > opus.game.gameWorld.position.y)
                    this.position.y--;
            }
            if (opus.input.isKeyPressed("left")) {
                if (this.position.x > opus.game.gameWorld.position.x)
                    this.position.x--;
            }
            if (opus.input.isKeyPressed("down")) {
                if (this.position.y < opus.game.gameWorld.height - this.height)
                    this.position.y++;
            }
            if (opus.input.isKeyPressed("right")) {
                if (this.position.x < opus.game.gameWorld.width - this.width)
                    this.position.x++;
            }
        }
    });

    game.onReady();
})();