(function() {
    opus.game = (function() {
        var publicApi = {};

        var initialised = false;

        publicApi.gameWorld = null;

        publicApi.init = function (width, height) {
            if (initialised === false) {
                publicApi.gameWorld = new opus.Container(0, 0, width, height);

                opus.timer.init();
            }
        };

        publicApi.update = function(time) {
            opus.timer.update(time);

            publicApi.gameWorld.update(time);
        };

        publicApi.render = function() {
            opus.renderer.clearScreen();

            opus.level.draw(opus.renderer.getContext());
            publicApi.gameWorld.render(opus.renderer.getContext());

            opus.renderer.drawFrontBuffer();
        };

        return publicApi;
    })();
})();