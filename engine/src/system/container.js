(function() {
    opus.Container = opus.Renderable.extend({
        init: function(posX, posY, width, height) {
            this._super(opus.Renderable, 'init', [posX, posY, width || Infinity, height || Infinity]);

            this.containedElements = [];
        },

        sort: function(a, b) {
            /* alpha sort if (a.zIndex < b.zIndex) {
                return -1;
            }
            if (a.zIndex > b.zIndex) {
                return 1;
            }
            return 0;*/

            // Numeric Sort
            return b.zIndex - a.zIndex;
        },

        addElement: function(element, zIndex) {
            if (typeof zIndex === 'undefined') {
                element.zIndex = this.containedElements.length;
            }

            if (typeof zIndex === 'number') {
                element.zIndex = zIndex;
            }

            this.containedElements.push(element);

            this.containedElements.sort(this.sort);

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