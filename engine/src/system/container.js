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
        },

        getContained: function() {
            return this.containedElements;
        }
    });
})();