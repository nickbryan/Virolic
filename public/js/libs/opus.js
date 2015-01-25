(function() {

    /**
     * Create the global namespace for the game engine.
     *
     * @type {object}
     */
    window.opus = window.opus || {};
})();
/**
 * window.performance polyfill used to get the most accurate time stamp
 */
(function() {
    if (typeof window.performance === "undefined") {
        window.performance = {};
    }

    if (typeof Date.now === "undefined") {
        Date.now = function () {
            return new Date().getTime();
        };
    }

    if (!window.performance.now) {
        var timeOffset = Date.now();

        if (window.performance.timing &&
            window.performance.timing.navigationStart) {
            timeOffset = window.performance.timing.navigationStart;
        }

        window.performance.now = function () {
            return Date.now() - timeOffset;
        }
    }
})();

/**
 * Based on Paul Irish requestAnimationFrame polyfill
 */
(function() {
    var fps = 1000 / 60;
    var lastFrameTime = 0;

    var vendors = ['ms', 'moz', 'webkit', 'o'];

    for (var vendor = 0; vendor < vendors.length && !window.requestAnimationFrame; vendor++) {
        window.requestAnimationFrame = window[vendors[vendor] + 'RequestAnimationFrame'];

        window.cancelAnimationFrame = window[vendors[vendor] + 'CancelAnimationFrame']
                                   || window[vendors[vendor] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function(callback) {
            var currentTime = window.performance.now();
            var timeToCall = Math.max(0, fps - (currentTime - lastFrameTime));
            var frameId = window.setTimeout(function() {
                callback(currentTime + timeToCall);
            }, timeToCall);

            lastFrameTime = currentTime + timeToCall;
            return frameId;
        };
    }

    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function (frameId) {
            window.clearTimeout(frameId);
        };
    }
})();
(function() {
    opus.debug = (function() {
        /**
         * Hold our public methods and parameters so we can return them
         * to the namespace.
         *
         * @type {object}
         */
        var publicApi = {};

        /**
         * Holds the debug panel object.
         *
         * @type {object}
         */
        var debugPanel = undefined;

        /**
         * Holds the debug table object.
         *
         * @type {object}
         */
        var debugTable = undefined;

        /**
         * Holds teh table body object.
         *
         * @type {undefined}
         */
        var debugTableBody = undefined;

        /**
         * Adds an element to the debug table.
         *
         * @param title
         * @param defaultValue
         * @param id
         */
        function addElement(title, defaultValue, id) {
            var tr = document.createElement('tr');
            var th = document.createElement('th');
            th.innerHTML = title + ':';
            var td = document.createElement('td');
            td.id = 'debug-' + id;
            td.innerHTML = defaultValue;
            tr.appendChild(th);
            tr.appendChild(td);
            debugTableBody.appendChild(tr);
        }

        /**
         * Draw the debug panel content.
         */
        publicApi.drawDebugPanel = function() {
            debugPanel = document.getElementById('debug-panel');
            debugTable = document.createElement('table');
            debugTableBody = document.createElement('tbody');
            addElement('Current Animation Frame', '0', 'anim-frame-id');
            addElement('FPS', '0', 'fps');
            addElement('Delta Time', '0', 'delta-time');
            addElement('Time Elapsed', '0', 'time-elapsed');
            debugTable.appendChild(debugTableBody);
            debugPanel.appendChild(debugTable);
        };

        /**
         * Update the content of the debug panel. Should
         * be called each frame loop.
         *
         * @param debugInfo
         */
        publicApi.update = function(debugInfo) {
            var frameIdBox = document.getElementById('debug-anim-frame-id');
            frameIdBox.innerHTML = debugInfo.animationFrameId;

            var frameIdBox = document.getElementById('debug-fps');
            frameIdBox.innerHTML = debugInfo.fps;

            var frameIdBox = document.getElementById('debug-delta-time');
            frameIdBox.innerHTML = debugInfo.delta + 'ms';

            var frameIdBox = document.getElementById('debug-time-elapsed');
            frameIdBox.innerHTML = debugInfo.timeElapsed + 's';
        };

        return publicApi;
    })();
})();
(function() {
    opus.timer = (function() {

        /**
         * Hold our public methods and parameters so we can return them
         * to the namespace.
         *
         * @type {object}
         */
        var publicApi = {};

        /**
         * Keep track of the number of rendered frames.
         *
         * @type {number}
         */
        var frameCount = 0;

        /**
         *  Keep track of the time it took to render frames.
         *
         * @type {number}
         */
        var frameDelta = 0;

        /**
         * Holds the timestamp of the last frame.
         *
         * @type {number}
         */
        var lastFrameTime = 0;

        /**
         * Holds the current frames time stamp.
         *
         * @type {number}
         */
        var currentFrameTime = 0;

        /**
         * Difference in time between last and current frame.
         *
         * @type {number}
         */
        var deltaTime = 0;

        /**
         * Hold the current FPS.
         *
         * @type {number}
         */
        publicApi.fps = 0;

        /**
         * Initialise the timer and set defaults.
         */
        publicApi.init = function() {
            publicApi.reset();
            currentFrameTime = lastFrameTime = 0;
        };

        /**
         * Reset the timer to its default state.
         */
        publicApi.reset = function() {
            lastFrameTime = currentFrameTime = window.performance.now();
            deltaTime = 0;
            frameCount = 0;
            frameDelta = 0;
        };

        /**
         * Calculate how many frames get rendered per second.
         */
        publicApi.countFps = function() {
            // Keep track of frames
            frameCount++;

            // Keep track of time took
            frameDelta += deltaTime;

            // Once ten frames have been rendered
            if (frameCount % 10 === 0) {
                // Number of rendered frames * 1000 / time took
                this.fps = Math.floor((1000 * frameCount) / frameDelta);

                // Reset
                frameDelta = 0;
                frameCount = 0;
            }
        };

        /**
         * Get the deltaTime rounded to .00
         *
         * @returns {number}
         */
        publicApi.getDeltaTime = function() {
            return Math.round(deltaTime * 100) / 100;
        };

        /**
         * Get the time elapsed since timer initialisation.
         *
         * @returns {number}
         */
        publicApi.getTimeElapsed = function() {
            return Math.round(currentFrameTime / 1000 * 100) / 100;
        };

        /**
         * Update the game frame times.
         * This should called once every update.
         *
         * @param time
         * @returns {number}
         */
        publicApi.update = function(time) {
            // Store the timestamp of the last frame
            lastFrameTime = currentFrameTime;

            // Store the current frames timestamp
            currentFrameTime = time;

            // DeltaTime is the time difference between the current and last frame
            deltaTime = (currentFrameTime - lastFrameTime);

            return deltaTime;
        };

        return publicApi;
    })();
})();
(function() {
    opus.game = (function() {
        var publicApi = {};

        var settings = {
            animationFrameId: -1
        };

        function gameLoop(time) {
            publicApi.update(time);
            publicApi.render();

            if (settings.animationFrameId !== -1) {
                settings.animationFrameId = window.requestAnimationFrame(gameLoop);
            }
        }

        publicApi.update = function(time) {
            opus.timer.update(time);
            opus.timer.countFps();
            settings.fps = opus.timer.fps;
            settings.delta = opus.timer.getDeltaTime();
            settings.timeElapsed = opus.timer.getTimeElapsed();
            opus.debug.update(settings);
        };

        publicApi.render = function() {

        };

        publicApi.startGameLoop = function() {
            // Check that the loop hasn't already been started
            if (settings.animationFrameId === -1) {
                settings.animationFrameId = window.requestAnimationFrame(gameLoop);
            }
        }

        publicApi.stopGameLoop = function() {
            window.cancelAnimationFrame(settings.animationFrameId);
            settings.animationFrameId = -1;
        }

        publicApi.init = function() {
            opus.timer.init();
            opus.debug.drawDebugPanel();
        };

        return publicApi;
    })();
})();
(function() {

});