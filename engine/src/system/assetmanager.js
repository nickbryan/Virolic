(function() {
    opus.assetmanager = (function() {
        /**
         * Hold our public methods and parameters so we can return them
         * to the namespace.
         *
         * @access private
         * @type {object}
         */
        var publicApi = {};

        /**
         * Holds all our cached images.
         *
         * @access private
         * @type {object}
         */
        var loadedImages = {};

        /**
         * Holds all our cached json files.
         *
         * @access private
         * @type {{}}
         */
        var loadedJSON = {};

        /**
         * Caches an image and loads it into the loadedImages container.
         *
         * @param name
         * @param imageSource
         */
        publicApi.loadImage = function (name, imageSource) {
            loadedImages[name] = new Image();
            loadedImages[name].src = imageSource;
        };

        /**
         * Logs all loaded images to the console.
         */
        publicApi.logLoadedImages = function() {
            console.log(loadedImages);
        };

        /**
         * Takes the name of the image and returns the image if found
         * or null if no image was found.
         *
         * @param image
         * @returns {*}
         */
        publicApi.getImage = function(imageName) {
            if (imageName in loadedImages) {
                return loadedImages[imageName];
            } else {
                return null;
            }
        };


        /**
         * Caches a json file into a json string and loads it into the
         * loadedJSON contianer.
         *
         * @param name
         * @param imageSource
         */
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

        /**
         * Gets the cached json string.
         *
         * @param json
         * @returns {*}
         */
        publicApi.getJSON = function(json) {
            if (json in loadedJSON) {
                return loadedJSON[json];
            } else {
                return null;
            }
        };

        // Return back to the global namespace
        return publicApi;
    })();
})();