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