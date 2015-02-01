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

/*
 * Copyright (c) 2014, Jay Oster
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice,
 *    this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */

/**
 * Extend a class prototype with the provided mixin descriptors.
 * Designed as a faster replacement for John Resig's Simple Inheritance.
 * @name extend
 * @memberOf external:Object#
 * @function
 * @param {Object[]} mixins... Each mixin is a dictionary of functions, or a
 * previously extended class whose methods will be applied to the target class
 * prototype.
 * @return {Object}
 * @example
 * var Person = Object.extend({
 *     "init" : function(isDancing) {
 *         this.dancing = isDancing;
 *     },
 *     "dance" : function() {
 *         return this.dancing;
 *     }
 * });
 *
 * var Ninja = Person.extend({
 *     "init" : function() {
 *         // Call the super constructor, passing a single argument
 *         this._super(Person, "init", [ false ]);
 *     },
 *     "dance" : function() {
 *         // Call the overridden dance() method
 *         return this._super(Person, "dance");
 *     },
 *     "swingSword" : function() {
 *         return true;
 *     }
 * });
 *
 * var Pirate = Person.extend(Ninja, {
 *     "init" : function() {
 *         // Call the super constructor, passing a single argument
 *         this._super(Person, "init", [ true ]);
 *     }
 * });
 *
 * var p = new Person(true);
 * console.log(p.dance()); // => true
 *
 * var n = new Ninja();
 * console.log(n.dance()); // => false
 * console.log(n.swingSword()); // => true
 *
 * var r = new Pirate();
 * console.log(r.dance()); // => true
 * console.log(r.swingSword()); // => true
 *
 * console.log(
 *     p instanceof Person &&
 *     n instanceof Ninja &&
 *     n instanceof Person &&
 *     r instanceof Pirate &&
 *     r instanceof Person
 * ); // => true
 *
 * console.log(r instanceof Ninja); // => false
 */
(function () {
    Object.defineProperty(Object.prototype, "extend", {
        "value" : function () {
            var methods = {};
            var mixins = Array.prototype.slice.call(arguments, 0);

            /**
             * The class constructor which creates the `_super` shortcut method
             * and calls the user `init` constructor if defined.
             * @ignore
             */
            function Class() {
                // Call the user constructor
                this.init.apply(this, arguments);
                return this;
            }

            // Apply superClass
            Class.prototype = Object.create(this.prototype);

            // Apply all mixin methods to the class prototype
            mixins.forEach(function (mixin) {
                apply_methods(Class, methods, mixin.__methods__ || mixin);
            });

            // Verify constructor exists
            if (!("init" in Class.prototype)) {
                throw "Object.extend: Class is missing a constructor named `init`";
            }

            // Apply syntactic sugar for accessing methods on super classes
            Object.defineProperty(Class.prototype, "_super", {
                "value" : _super
            });

            // Create a hidden property on the class itself
            // List of methods, used for applying classes as mixins
            Object.defineProperty(Class, "__methods__", {
                "value" : methods
            });

            return Class;
        }
    });

    /**
     * Apply methods to the class prototype.
     * @ignore
     */
    function apply_methods(Class, methods, descriptor) {
        Object.keys(descriptor).forEach(function (method) {
            methods[method] = descriptor[method];

            if (typeof(descriptor[method]) !== "function") {
                throw "Object.extend: Method `" + method + "` is not a function!";
            }

            Object.defineProperty(Class.prototype, method, {
                "configurable" : true,
                "value" : descriptor[method]
            });
        });
    }

    /**
     * Special method that acts as a proxy to the super class.
     * @name _super
     * @ignore
     */
    function _super(superClass, method, args) {
        return superClass.prototype[method].apply(this, args);
    };
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

        var initialised = false;

        publicApi.gameWorld = null;

        publicApi.init = function (width, height) {
            if (initialised === false) {
                publicApi.gameWorld = new opus.Container(0, 0, width, height);

                opus.timer.init();
            }
        };

        publicApi.update = function(time) {
            opus.timer.update(time);

            publicApi.gameWorld.update(time);
        };

        publicApi.render = function() {
            opus.renderer.clearScreen();

            publicApi.gameWorld.render(opus.renderer.getContext());
        };

        return publicApi;
    })();
})();
(function() {
    opus.vector2d = Object.extend({
       init: function(x, y) {
            return this.set(x || 0, y || 0);
       },

       set: function(x, y) {
           if (isNaN(x)) {
               throw new Error("Invalid x parameter for vector");
           }
           if (isNaN(y)) {
               throw new Error("Invalid y parameter for vector");
           }

           this.x = x;

           this.y = y;

           return this;
       }
    });
})();
(function() {
    opus.Rectangle = Object.extend({
        init: function(xPos, yPos, width, height) {
            this.position = new opus.vector2d(xPos, yPos);

            this.width = width;

            this.height = height;
        },

        set: function(xPos, yPos, width, height) {
            this.position.set(xPos, yPos);

            this.resize(width, height);

            return this;
        },

        resize: function(width, height) {
            this.width = width;
            this.height = height;
            return this;
        },

        getBounds: function() {
            return this;
        }
    });
})();
(function() {
    opus.Renderable = opus.Rectangle.extend({
        init: function(xPos, yPos, width, height) {
            this.zIndex = NaN;

            this._super(opus.Rectangle, 'init', [xPos, yPos, width, height]);
        },

        update: function() {
            // Extend this
        },

        render: function() {
            // Extend this
        }
    });
})();
(function() {
    opus.renderer = (function() {
        var publicApi = {};

        var canvas = null;
        var wrapper = null;
        var context = null;

        publicApi.init = function(screen_width, screen_height) {
            canvas = publicApi.createCanvas(screen_width, screen_height);

            wrapper = document.getElementById('game-screen');
            wrapper.appendChild(canvas);

            context =  canvas.getContext('2d');

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
            context.save();
            context.setTransform(1, 0, 0, 1, 0, 0);
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.restore();
        };

        publicApi.getContext = function() {
            return context;
        };

        return publicApi;
    })();
})();
(function() {
    opus.Container = opus.Renderable.extend({
        init: function(posX, posY, width, height) {
            this._super(opus.Renderable, 'init', [posX, posY, width || Infinity, height || Infinity]);

            this.containedElements = [];
        },

        addElement: function(element, zIndex) {
            if (typeof zIndex === 'number') {
                element.zIndex = zIndex;
            }

            if (typeof element.zIndex === 'undefined') {
                element.zIndex = this.containedElements.length;
            }

            this.containedElements.push(element);

            return element;
        },

        update: function(deltaTime) {
            for (var i = this.containedElements.length, obj; i--, (obj = this.containedElements[i]);) {
                obj.update(deltaTime);
            }
        },

        render: function(renderer) {
            for (var i = this.containedElements.length, obj; i--, (obj = this.containedElements[i]);) {
                obj.draw(renderer);
            }
        }
    });
})();
(function() {
    opus.gamescreen = Object.extend({
        init: function() {
            // Not sure what to do with this yet
        },

        reset: function() {
            this.onReset();
        },

        onReset: function() {
            // Extend this
        }
    });
})();
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
(function() {

    opus.input = (function() {
        var publicApi = {};



        return publicApi;
    })();
})();
(function() {
    var input = opus.input;

    var boundKeys = {};

    var keyboardInitialised = false;

    var keyStatus = {};

    input.KEY = {
        "BACKSPACE": 8,
        "TAB": 9,
        "ENTER": 13,
        "SHIFT": 16,
        "CTRL": 17,
        "ALT": 18,
        "PAUSE": 19,
        "CAPS_LOCK": 20,
        "ESC": 27,
        "SPACE": 32,
        "PAGE_UP": 33,
        "PAGE_DOWN": 34,
        "END": 35,
        "HOME": 36,
        "LEFT": 37,
        "UP": 38,
        "RIGHT": 39,
        "DOWN": 40,
        "PRINT_SCREEN": 42,
        "INSERT": 45,
        "DELETE": 46,
        "NUM0": 48,
        "NUM1": 49,
        "NUM2": 50,
        "NUM3": 51,
        "NUM4": 52,
        "NUM5": 53,
        "NUM6": 54,
        "NUM7": 55,
        "NUM8": 56,
        "NUM9": 57,
        "A": 65,
        "B": 66,
        "C": 67,
        "D": 68,
        "E": 69,
        "F": 70,
        "G": 71,
        "H": 72,
        "I": 73,
        "J": 74,
        "K": 75,
        "L": 76,
        "M": 77,
        "N": 78,
        "O": 79,
        "P": 80,
        "Q": 81,
        "R": 82,
        "S": 83,
        "T": 84,
        "U": 85,
        "V": 86,
        "W": 87,
        "X": 88,
        "Y": 89,
        "Z": 90,
        "WINDOW_KEY": 91,
        "NUMPAD0": 96,
        "NUMPAD1": 97,
        "NUMPAD2": 98,
        "NUMPAD3": 99,
        "NUMPAD4": 100,
        "NUMPAD5": 101,
        "NUMPAD6": 102,
        "NUMPAD7": 103,
        "NUMPAD8": 104,
        "NUMPAD9": 105,
        "MULTIPLY": 106,
        "ADD": 107,
        "SUBSTRACT": 109,
        "DECIMAL": 110,
        "DIVIDE": 111,
        "F1": 112,
        "F2": 113,
        "F3": 114,
        "F4": 115,
        "F5": 116,
        "F6": 117,
        "F7": 118,
        "F8": 119,
        "F9": 120,
        "F10": 121,
        "F11": 122,
        "F12": 123,
        "NUM_LOCK": 144,
        "SCROLL_LOCK": 145,
        "SEMICOLON": 186,
        "PLUS": 187,
        "COMMA": 188,
        "MINUS": 189,
        "PERIOD": 190,
        "FORWAND_SLASH": 191,
        "GRAVE_ACCENT": 192,
        "OPEN_BRACKET": 219,
        "BACK_SLASH": 220,
        "CLOSE_BRACKET": 221,
        "SINGLE_QUOTE": 222
    };

    input.bindKey = function(keyCode, action) {
        input.enableKeyboadEvent();
        boundKeys[keyCode] = action;
        keyStatus[action] = false;
    };

    input.enableKeyboadEvent = function() {
        if (!keyboardInitialised) {
            window.addEventListener("keydown", input.keyDown, false);
            window.addEventListener("keyup", input.keyUp, false);
            keyboardInitialised = true;
        }
    };

    input.keyDown = function(e, keyCode, mouseButton) {
        keyCode = keyCode || e.keyCode || e.which;
        var action = boundKeys[keyCode];

        keyStatus[action] = true;

        return true;
    };

    input.keyUp = function(e, keyCode, mouseButton) {
        keyCode = keyCode || e.keyCode || e.which;
        var action = boundKeys[keyCode];

        keyStatus[action] = false;

        return true;
    };

    input.isKeyPressed = function(action) {
        if (keyStatus[action]) {
            return true;
        }
        return false;
    };
})();
(function() {
    opus.blob = opus.Renderable.extend({
        init: function(x, y, width, height) {
            this._super(opus.Renderable, "init", [x, y, width, height]);
        },

        draw: function(renderer) {
            renderer.fillRect(this.position.x, this.position.y, this.width, this.height);
        },

        update: function(dt) {
            if (opus.input.isKeyPressed("forward")) {
                this.position.y--;
            }
            if (opus.input.isKeyPressed("left")) {
                this.position.x--;
            }
            if (opus.input.isKeyPressed("down")) {
                this.position.y++;
            }
            if (opus.input.isKeyPressed("right")) {
                this.position.x++;
            }
        }
    });
})();