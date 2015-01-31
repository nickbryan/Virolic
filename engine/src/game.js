(function() {
    opus.game = (function() {
        var publicApi = {};

        var settings = {
        };

        publicApi.init = function() {
            opus.timer.init();
        };

        publicApi.update = function(time) {
            opus.timer.update(time);

            if (opus.input.isKeyPressed("forward")) {
                console.log('forward');
            }
            if (opus.input.isKeyPressed("left")) {
                console.log('left');
            }
            if (opus.input.isKeyPressed("down")) {
                console.log('down');
            }
            if (opus.input.isKeyPressed("right")) {
                console.log('right');
            }
        };

        publicApi.render = function() {

        };

        return publicApi;
    })();
})();