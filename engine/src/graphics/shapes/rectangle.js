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