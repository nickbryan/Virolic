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

        // Return to the global namespace
        return publicApi;
    })();
})();