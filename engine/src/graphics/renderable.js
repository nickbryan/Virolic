(function() {
    opus.Renderable = opus.Rectangle.extend({
        init: function(xPos, yPos, width, height, type) {
            this.zIndex = NaN;

            this.type = type;

            this._super(opus.Rectangle, 'init', [xPos, yPos, width, height]);
        },

        update: function() {
            // Extend this
        },

        draw: function() {
            // Extend this
        }
    });
})();