(function() {
    opus.renderer = (function() {
        var publicApi = {};

        var canvas = null;
        var wrapper = null;
        var context = null;
        var backBuffer = null;
        var backBufferContext = null;

        publicApi.init = function(screen_width, screen_height) {
            canvas = publicApi.createCanvas(screen_width, screen_height);
            backBuffer = publicApi.createCanvas(screen_width, screen_height);

            wrapper = document.getElementById('game-screen');
            wrapper.appendChild(canvas);

            context =  canvas.getContext('2d');
            backBufferContext =  backBuffer.getContext('2d');

            opus.game.init(screen_width, screen_height);

            return true;
        };

        publicApi.createCanvas = function(width, height) {
            if (width == 0 || height == 0) {
                console.log("Width and height need to be greater than zero for canvas creation.")
            }

            var _canvas = document.createElement('canvas');
            _canvas.width = width || canvas.width;
            _canvas.height = height || canvas.height;

            return _canvas;
        };

        publicApi.clearScreen = function() {
            backBufferContext.save();
            backBufferContext.setTransform(1, 0, 0, 1, 0, 0);
            backBufferContext.fillStyle = 'white';
            backBufferContext.fillRect(0, 0, canvas.width, canvas.height);
            backBufferContext.restore();
        };

        publicApi.getContext = function() {
            return backBufferContext;
        };

        publicApi.drawFrontBuffer = function() {
            context.drawImage(backBuffer, 0, 0);
        };

        return publicApi;
    })();
})();