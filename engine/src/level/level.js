(function() {

    opus.layer = opus.Renderable.extend({

        init: function(levelSprite, layerData, tileWidth, tileHeight, width, height, offset, imageWidth, imageHeight) {
            this._super(opus.Renderable, "init", [0, 0, width, height]);

            this.imageWidth = imageWidth;
            this.imageHeight = imageHeight;
            this.levelSprite = levelSprite;
            this.layerData = layerData;
            this.tileWidth = tileWidth;
            this.tileHeight = tileHeight;
            this.tileSet = [];
            this.offset = offset; ///NEEDS FIXING

            this.initLevel();
        },

        initLevel: function() {
            var columns = this.imageWidth / this.tileWidth; // 22
            var rows = this.imageHeight / this.tileHeight;  // 18

            for (var y = 0; y < rows; y++) {
                for (var x = 0; x < columns; x++) {
                    this.tileSet.push({
                        pointX: x * this.tileWidth,
                        pointY: y * this.tileHeight
                    });
                }
            }
        },

        draw: function(renderer) {

            var index = 0;
            for (var mapHeight = 0; mapHeight < this.height; mapHeight++) {
                for (var mapWidth = 0; mapWidth < this.width; mapWidth++) {
                    var currentTile = this.layerData.data[index] - this.offset;
                    if (currentTile >= 0) {
                        renderer.drawImage(this.levelSprite,
                            this.tileSet[currentTile].pointX, this.tileSet[currentTile].pointY, this.tileWidth,
                            this.tileHeight, 0 + this.tileHeight * mapWidth, 0 + this.tileWidth * mapHeight,
                            this.tileWidth, this.tileHeight);
                    }
                    index++;
                }
            }
        }
    });
})();