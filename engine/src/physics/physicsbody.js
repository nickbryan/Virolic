(function() {
    opus.PhysicsBody = opus.Rectangle.extend({
        init: function(entity) {
            this.entity = entity;

            if (typeof this.velocity == "undefined") {
                this.velocity = new opus.vector2d();
            }
            this.velocity.init();

            if (typeof this.maxVelocity == "undefined") {
                this.maxVelocity = new opus.vector2d();
            }
            this.maxVelocity.init();

            if (typeof this.acceleration == "undefined") {
                this.acceleration = new opus.vector2d();
            }
            this.acceleration.init();

            this._super(opus.Rectangle, "init", [0, 0, this.entity.width, this.entity.height]);
        },

        calculateSpeed: function() {
            // Cap Movement
            if (this.velocity.x !== 0) {
                this.velocity.x = this.velocity.x.clamp(-this.maxVelocity.x, this.maxVelocity.x);
            }
            if (this.velocity.y !== 0) {
                this.velocity.y = this.velocity.y.clamp(-this.maxVelocity.y, this.maxVelocity.y);
            }
        },

        update: function(time) {
            this.calculateSpeed();
            //console.log(this.velocity);

            this.entity.position.addTo(this.velocity);
        }
    });
})();