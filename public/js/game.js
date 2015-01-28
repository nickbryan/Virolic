(function(){

    var start = document.getElementById('start');
    var stop = document.getElementById('stop');


    var wrapper = document.getElementById('game-screen');
    opus.renderer.init(800,600);

    opus.input.bindKey(opus.input.KEY.W, "forward");

    start.onclick = function() {
        opus.game.startGameLoop();
    };

    stop.onclick = function() {
        opus.game.stopGameLoop();
    };
})();