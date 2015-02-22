(function() {

    opus.Entity = opus.Renderable.extend({
        init: function(x, y, width, height, name) {
            this._super(opus.Renderable, "init",[
                x, y, width, height
            ]);

            this.name = name;

            this.alive = true;
        },

        update: function(deltaTime) {
            this._super(opus.Renderable, "update", [deltaTime]);
        },

        draw: function(renderer) {
            this._super(opus.Renderable, "draw", [renderer]);
            renderer.fillRect(this.position.x, this.position.y, this.width, this.height);
        }
    });
})();