(function() {
    opus.assetmanager = (function() {
        var publicApi = {};

        var loadedImages = {};
        var loadedJSON = {};

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
        };

        publicApi.loadJSON = function (name, source) {
            var xmlhttp = new XMLHttpRequest();

            if (xmlhttp.overrideMimeType) {
                xmlhttp.overrideMimeType("application/json");
            }

            xmlhttp.open("GET", source, true);

            // set the callbacks
            xmlhttp.ontimeout = onerror;
            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState === 4) {
                    // status = 0 when file protocol is used, or cross-domain origin,
                    // (With Chrome use "--allow-file-access-from-files --disable-web-security")
                    if ((xmlhttp.status === 200) || ((xmlhttp.status === 0) && xmlhttp.responseText)) {
                        // get the Texture Packer Atlas content
                        loadedJSON[name] = JSON.parse(xmlhttp.responseText);
                        // fire the callback
                        //onload();
                    }
                    else {
                        //onerror();
                    }
                }
            };
            // send the request
            xmlhttp.send(null);
        };

        publicApi.getJSON = function(json) {
            if (json in loadedJSON) {
                return loadedJSON[json];
            } else {
                return null;
            }
        };

        return publicApi;
    })();
})();