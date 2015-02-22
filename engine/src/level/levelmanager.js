(function() {

    opus.LevelManager = (function() {
        var publicApi = {};

        var mapData  = null;
        var layers = [];

        publicApi.init = function() {
            mapData = opus.assetmanager.getJSON("Map");
            layers = mapData.layers;

            var test = 0;
            for (var layer in layers) {
                if (layers[layer].name == "Spawn") continue;

                if (layers[layer].name == "Collisions") {
                    for (var collisionObject in layers[layer].objects) {
                        opus.game.gameWorld.addElement(new opus.Renderable(
                            layers[layer].objects[collisionObject].x,
                            layers[layer].objects[collisionObject].y,
                            layers[layer].objects[collisionObject].width,
                            layers[layer].objects[collisionObject].height,
                            'collision'
                        ));
                    }
                } else {
                    if (test == 0) {
                        opus.game.gameWorld.addElement(new opus.layer(
                            opus.assetmanager.getImage("Grass"),
                            layers[layer],
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
                            layers[layer],
                            mapData.tilewidth,
                            mapData.tileheight,
                            mapData.width,
                            mapData.height,
                            10,
                            mapData.tilesets[1].imagewidth,
                            mapData.tilesets[1].imageheight
                        ));
                    }
                }

                test++;
            }
        };

        return publicApi;
    })();
})();