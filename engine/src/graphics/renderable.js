(function() {
    opus.Renderable = opus.Rectangle.extend({
        init: function(xPos, yPos, width, height) {
            this.zIndex = NaN;

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