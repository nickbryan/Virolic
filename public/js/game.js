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
            opus.game.gameWorld.addElement(new opus.blob(100, 20, 20, 20));
            opus.game.gameWorld.addElement(new opus.blob(40, 400, 40, 30));
            opus.game.gameWorld.addElement(new opus.blob(500, 50, 10, 50));
            opus.game.gameWorld.addElement(new opus.blob(60, 60, 20, 20));

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