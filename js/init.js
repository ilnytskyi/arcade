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
        this.data = {
            id: 'grid',
            width: window.innerWidth,
            height: window.innerHeight,
        };
        _super.call(this, data);
        this.setCanvas(this.data.id);
    }
    Canvas.prototype.setCanvas = function (id) {
        var cx = document.getElementById(id);
        if (!cx) {
            var canvas = document.createElement('canvas');
            canvas.id = id;
            canvas.width = this.data.width;
            canvas.height = this.data.height;
            document.body.appendChild(canvas);
            cx = document.getElementById(id);
        }
        this.cx = cx.getContext('2d');
    };
    Canvas.prototype.drawRect = function (x, y, width, height, color) {
        this.cx.beginPath();
        this.cx.fillStyle = color;
        this.cx.fillRect(x, y, width, height);
        this.cx.closePath();
        return this;
    };
    Canvas.prototype.clear = function () {
        this.cx.clearRect(0, 0, this.data.width, this.data.height);
        return this;
    };
    return Canvas;
})(Abstract);
var Target = (function () {
    function Target(x, y, width, height, color) {
        this.position = {
            x: x,
            y: y,
        };
    }
    return Target;
})();
var TargetsCollection = (function () {
    function TargetsCollection() {
        this.targets = [];
    }
    TargetsCollection.prototype.add = function (target) {
        this.targets[target.id] = target;
    };
    TargetsCollection.prototype.getTarget = function (target) {
        return this.targets[target.id];
    };
    TargetsCollection.prototype.unset = function (target) {
        delete this.targets[target.id];
        return this;
    };
    return TargetsCollection;
})();
var Game = (function (_super) {
    __extends(Game, _super);
    function Game(data) {
        var _this = this;
        this.animate = function () {
            var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
            _this.time = new Date();
            _this.updateFrame();
            requestAnimationFrame(_this.animate);
        };
        this.data = {
            padding: 10,
            borders: 5,
            gun: {
                width: 15,
                height: 5,
                step: 5,
            }
        };
        _super.call(this, data);
        var canvas = new Canvas({
            width: 320,
            height: 480,
        });
        this.canvas = canvas;
        this.time = new Date();
        this.K = {
            up: 38,
            left: 37,
            down: 40,
            right: 39,
            space: 32,
        };
    }
    Game.prototype.renderFrame = function () {
        var cv = this.canvas;
        cv.clear();
        this.setBorders()
            .setGun();
    };
    Game.prototype.updateFrame = function () {
        var cv = this.canvas;
        cv.clear();
        this.setBorders()
            .updateGun();
    };
    Game.prototype.setBorders = function () {
        var cv = this.canvas;
        cv.drawRect(this.data.padding, 0, this.data.borders, cv.data.height, '#000');
        var right = cv.data.width - this.data.padding - this.data.borders;
        cv.drawRect(right, 0, this.data.borders, cv.data.height, '#000');
        this.leftBorder = this.data.padding + this.data.borders;
        this.rightBorder = right;
        return this;
    };
    Game.prototype.setGun = function () {
        var cv = this.canvas;
        var between = this.rightBorder - this.leftBorder;
        var position = (between / 2);
        this.data.gun.position = position;
        cv.drawRect(position, cv.data.height - this.data.padding, this.data.gun.width, this.data.gun.height, '#000');
        return this;
    };
    Game.prototype.updateGun = function () {
        var cv = this.canvas;
        var between = this.rightBorder - this.leftBorder;
        var position = this.data.gun.position;
        if (position <= this.leftBorder)
            position = this.leftBorder;
        var rightLimit = this.rightBorder - this.data.gun.width;
        if (position >= rightLimit)
            position = rightLimit;
        this.data.gun.position = position;
        cv.drawRect(position, cv.data.height - this.data.padding, this.data.gun.width, this.data.gun.height, '#000');
    };
    Game.prototype.handlers = function () {
        var _this = this;
        document.addEventListener('keydown', function (e) {
            var key = e.keyCode;
            var step = _this.data.gun.step;
            if (key == _this.K.left)
                _this.data.gun.position -= step;
            if (key == _this.K.right)
                _this.data.gun.position += step;
        }, true);
        window.addEventListener("deviceorientation", function (event) {
            _this.deviceMovementDirection(event);
        }, true);
    };
    Game.prototype.deviceMovementDirection = function (event) {
        window.device = window.device || {};
        window.device.changeMin = window.device.changeMin || 0;
        window.device.changePlu = window.device.changePlu || 0;
        var alpha = event.alpha.toFixed(0) * 1;
        var beta = event.beta.toFixed(0) * 1;
        var gamma = event.gamma.toFixed(0) * 1;
        var step = this.data.gun.step;
        //if (beta < 45 ) {
        //    if (alpha <= 0) {
        //
        //        device.changePlu = 0;
        //
        //        device.changeMin = alpha;
        //
        //    } else {
        //
        //        device.changeMin = 0;
        //
        //        device.changePlu = alpha;
        //
        //    }
        //} else {
        //    if (gamma <= 0) {
        //
        //        device.changePlu = 0;
        //
        //        device.changeMin = gamma;
        //
        //    } else {
        //
        //        device.changeMin = 0;
        //
        //        device.changePlu = gamma;
        //
        //    }
        //}
        var dir = null;
        if (beta > 45 && beta < 135) {
            dir = this.deviceDirectionBy(gamma);
        }
        else {
            dir = !this.deviceDirectionBy(alpha);
        }
        if (dir == null)
            return;
        if (dir) {
            this.data.gun.position += 1;
        }
        else {
            this.data.gun.position -= 1;
        }
        var v = {
            alpha: alpha,
            beta: beta,
            gamma: gamma
        };
        document.getElementById('debug').innerHTML = JSON.stringify(v) + "\n\n" + dir;
    };
    Game.prototype.deviceDirectionBy = function (axis) {
        var r = null;
        if (axis == 0)
            return null;
        if (axis < 0) {
            device.changePlu = 0;
            r = axis > device.changeMin;
            device.changeMin = axis;
        }
        else {
            device.changeMin = 0;
            r = axis > device.changePlu;
            device.changePlu = axis;
        }
        return r;
    };
    Game.prototype.init = function () {
        this.renderFrame();
        this.handlers();
        this.animate();
        console.log(this);
    };
    return Game;
})(Abstract);
var g = new Game();
g.init();
//# sourceMappingURL=init.js.map