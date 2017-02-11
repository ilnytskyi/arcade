var Canvas = (function () {
    function Canvas(config) {
        this.config = {
            id: 'grid',
            width: screen.width,
            height: screen.height,
        };
        this.setCustomConfig(config);
        this.setCanvas(this.config.id);
    }
    Canvas.prototype.setCustomConfig = function (config) {
        for (var item in config) {
            this.config[item] = config[item];
        }
    };
    Canvas.prototype.setCanvas = function (id) {
        var cx = document.getElementById(id);
        if (!cx) {
            var canvas = document.createElement('canvas');
            canvas.id = id;
            canvas.width = this.config.width;
            canvas.height = this.config.height;
            document.body.appendChild(canvas);
            cx = document.getElementById(id);
        }
        this.cx = cx.getContext('2d');
    };
    return Canvas;
})();
var g = new Canvas({
    id: 'canvas',
    width: 460,
    height: 740
});
//# sourceMappingURL=init.js.map