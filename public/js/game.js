(function(){

    var game = {
        onReady: function() {
            // var wrapper = document.getElementById('game-screen');
            opus.renderer.init(800,600);

            opus.input.bindKey(opus.input.KEY.W, "forward");
            opus.input.bindKey(opus.input.KEY.A, "left");
            opus.input.bindKey(opus.input.KEY.S, "down");
            opus.input.bindKey(opus.input.KEY.D, "right");

            opus.game.gameWorld.addElement(new opus.blob(350, 100, 20, 20));
            opus.game.gameWorld.addElement(new opus.blob(400, 100, 20, 20));

            opus.assetmanager.loadImage('Map1', './js/resources/map1_tileset.png');
            opus.assetmanager.loadedImages();

            opus.gamestate.setGameState(opus.gamestate.PLAY, new game.PlayScreen());
            opus.gamestate.changeGameState(opus.gamestate.PLAY);
        }
    };

    game.PlayScreen = opus.gamescreen.extend({
        onReset: function() {
            console.log("GOT RESET WOOP!");
            /***********
             * THIS ISNT WORKING!!!!
             */
        }
    });

    game.onReady();
})();