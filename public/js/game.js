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

                opus.game.gameWorld.addElement(new opus.blob(350, 100, 16, 16), 3);

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

            // opus.level.init();
        }
    });
    game.onReady();
})();