(function(){

    var game = {
        onReady: function() {
            // var wrapper = document.getElementById('game-screen');
            opus.renderer.init(800,600);

            opus.input.bindKey(opus.input.KEY.W, "forward");
            opus.input.bindKey(opus.input.KEY.A, "left");
            opus.input.bindKey(opus.input.KEY.S, "down");
            opus.input.bindKey(opus.input.KEY.D, "right");

            opus.gamestate.setGameState(opus.gamestate.PLAY, new game.PlayScreen());
            opus.gamestate.changeGameState(opus.gamestate.PLAY);
        }
    };

    game.PlayScreen = opus.gamescreen.extend({
        onResetEvent: function() {
            console.log("GOT RESET WOOP!");
        }
    });

    game.onReady();
})();