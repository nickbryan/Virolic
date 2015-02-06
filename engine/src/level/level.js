(function() {

    opus.level = (function() {
        var publicApi = {};
        var levelSprite = null;

        publicApi.init = function() {
            levelSprite = opus.assetmanager.getImage('Map1');
        };

        publicApi.draw = function(renderer) {
            for (var y = 0; y < opus.game.screen_height / 32; y++) {
                for (var x = 0; x < opus.game.screen_width / 32; x++) {
                    renderer.drawImage(levelSprite, 0, 0, 32, 32, 0 + 32 * x, 0 + 32 * y, 32, 32);
                }
            }
        };

        return publicApi;
    })();
})();