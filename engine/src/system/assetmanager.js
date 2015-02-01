(function() {
    opus.assetmanager = (function() {
        var publicApi = {};

        var loadedImages = {};

        publicApi.loadImage = function (name, imageSource) {
            loadedImages[name] = new Image();
            loadedImages[name].src = imageSource;
        };

        publicApi.loadedImages = function() {
            console.log(loadedImages);
        };

        publicApi.getImage = function(image) {
            if (image in loadedImages) {
                return loadedImages[image];
            } else {
                return null;
            }
        }

        return publicApi;
    })();
})();