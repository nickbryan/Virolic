(function() {

    opus.level = (function() {
        var publicApi = {};
        var levelSprite = null;

        publicApi.init = function() {
            levelSprite = opus.assetmanager.getImage('Map1');
        };

        publicApi.draw = function(renderer) {
            renderer.drawImage(levelSprite, 0, 0, 32, 32, 0, 0, 32, 32);
        };

        return publicApi;
    })();
})();