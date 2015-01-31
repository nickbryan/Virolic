(function() {
    opus.gamestate = (function () {
        var publicApi = {};

        var animationFrameId = -1;

        var currentState = -1;

        var gameScreens = {};

        function gameLoop(time) {
            opus.game.update(time);
            opus.game.render(time);

            if (animationFrameId !== -1) {
                animationFrameId = window.requestAnimationFrame(gameLoop);
            }
        }

        function startGameLoop() {
            // Check that the loop hasn't already been started
            if (animationFrameId === -1) {
                animationFrameId = window.requestAnimationFrame(gameLoop);
            }
        }

        function stopGameLoop() {
            window.cancelAnimationFrame(animationFrameId);
            animationFrameId = -1;
        }

        publicApi.PLAY = 0;

        publicApi.setGameState = function(gameState, gameScreen) {
            gameScreens[gameState] = {};
            gameScreens[gameState].screen = gameScreen;
        };

        publicApi.changeGameState = function(state) {
            stopGameLoop();

            if (gameScreens[currentState]) {
                // remove current state
            }

            if (gameScreens[state]) {
                currentState = state;

                gameScreens[currentState].screen.reset;

                startGameLoop();
            }
        };

        return publicApi;
    })();
})();;