var Abstract = (function () {
    function Abstract(data) {
        this.setCustomData(data);
    }
    Abstract.prototype.setCustomData = function (data) {
        for (var item in data) {
            this.data[item] = data[item];
        }
    };
    return Abstract;
})();
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Canvas = (function (_super) {
    __extends(Canvas, _super);
    function Canvas(data) {
        _super.call(this, data);
        this.data = {
            id: 'grid',
            width: screen.width,
            height: screen.height,
        };
        this.setCanvas(this.data.id);
    }
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
})(Abstract);
var Game = (function (_super) {
    __extends(Game, _super);
    function Game(data) {
        _super.call(this, data);
    }
    return Game;
})(Abstract);
var g = new Canvas({
    id: 'canvas',
    width: 460,
    height: 740
});
//# sourceMappingURL=init.js.map