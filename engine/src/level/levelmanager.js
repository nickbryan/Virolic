(function() {

    opus.LevelManager = (function() {
        var publicApi = {};

        var mapData  = null;
        var layers = [];

        publicApi.init = function() {
            mapData = opus.assetmanager.getJSON("Map");
            layers = mapData.layers;

            var test = 0;
            for (var i = 0; i < 4; i++) {
                if (test == 0) {
                    opus.game.gameWorld.addElement(new opus.layer(
                        opus.assetmanager.getImage("Grass"),
                        layers[i],
                        mapData.tilewidth,
                        mapData.tileheight,
                        mapData.width,
                        mapData.height,
                        1,
                        mapData.tilesets[0].imagewidth,
                        mapData.tilesets[0].imageheight
                    ));
                } else {
                    opus.game.gameWorld.addElement(new opus.layer(
                        opus.assetmanager.getImage("MainTileSet"),
                        layers[i],
                        mapData.tilewidth,
                        mapData.tileheight,
                        mapData.width,
                        mapData.height,
                        10,
                        mapData.tilesets[1].imagewidth,
                        mapData.tilesets[1].imageheight
                    ));
                }

                test++;
            }
        };

        return publicApi;
    })();
})();