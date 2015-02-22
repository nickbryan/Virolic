(function() {
    opus.game = (function() {
        /**
         * Hold our public methods and parameters so we can return them
         * to the namespace.
         *
         * @access private
         * @type {object}
         */
        var publicApi = {};

        /**
         * Lets us know if the game has been initialised or not.
         *
         * @access private
         * @type {boolean}
         */
        var initialised = false;

        /**
         * Width of the canvas screen.
         *
         * @access public
         * @type {number}
         */
        publicApi.screen_width = 0;

        /**
         * Height of the canvas screen.
         *
         * @access public
         * @type {number}
         */
        publicApi.screen_height = 0;

        /**
         * Our main game container.
         *
         * @access public
         * @type {object}
         */
        publicApi.gameWorld = null;

        /**
         * Initialise our game.
         *
         * @param width
         * @param height
         */
        publicApi.init = function (width, height) {
            publicApi.screen_width = width;
            publicApi.screen_height = height;
            if (initialised === false) {
                publicApi.gameWorld = new opus.Container(0, 0, width, height);

                opus.timer.init();
            }
        };

        /**
         * Update all entities in the game world container.
         *
         * @param time
         */
        publicApi.update = function(time) {
            opus.timer.update(time);

            publicApi.gameWorld.update(time);
        };

        /**
         * Draw all entities and level stuff.
         */
        publicApi.render = function() {
            opus.renderer.clearScreen();

            publicApi.gameWorld.render(opus.renderer.getContext());

            opus.renderer.drawFrontBuffer();
        };

        // Return to the global namespace
        return publicApi;
    })();
})();