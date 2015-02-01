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