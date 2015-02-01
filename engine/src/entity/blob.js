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