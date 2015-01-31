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