(function(){

    var start = document.getElementById('start');
    var stop = document.getElementById('stop');

    opus.game.init();

    start.onclick = function() {
        opus.game.startGameLoop();
    };

    stop.onclick = function() {
        opus.game.stopGameLoop();
    };
})();