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
                if (this.position.y > opus.game.gameWorld.position.y)
                this.position.y--;
            }
            if (opus.input.isKeyPressed("left")) {
                if (this.position.x > opus.game.gameWorld.position.x)
                this.position.x--;
            }
            if (opus.input.isKeyPressed("down")) {
                if (this.position.y < opus.game.gameWorld.height - this.height)
                this.position.y++;
            }
            if (opus.input.isKeyPressed("right")) {
                if (this.position.x < opus.game.gameWorld.width - this.width)
                this.position.x++;
            }
        }
    });
})();