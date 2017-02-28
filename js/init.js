function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + s4();
}
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
        this.cx.fillStyle = color || '#000';
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
var Entity = (function () {
    function Entity(x, y, width, height, color) {
        this.id = guid();
        this.x = x;
        this.y = y;
        this.height = height || 10;
        this.width = width || 10;
        this.color = color || '#ff00';
    }
    Entity.prototype.detectCollision = function (e) {
        var vertical = (this.y + this.height) >= e.y && (e.y + e.height) >= this.y;
        var horizontal = (this.x + this.width) >= e.x && (e.x + e.width) >= this.x;
        //if (vertical && horizontal) {
        //    this.color = '#000';
        //    e.color = '#000';
        //}
        return vertical && horizontal;
    };
    return Entity;
})();
var Target = (function (_super) {
    __extends(Target, _super);
    function Target(x, y, width, height, color) {
        _super.call(this, x, y, width, height, color);
        this.width = width || 15;
        this.height = height || 15;
        this.color = color || '#d49661';
    }
    return Target;
})(Entity);
var Bullet = (function (_super) {
    __extends(Bullet, _super);
    function Bullet(x, y, width, height, color) {
        _super.call(this, x, y, width, height, color);
        this.width = width || 5;
        this.height = height || 5;
        this.color = color || '#f00';
    }
    return Bullet;
})(Entity);
var Collection = (function () {
    function Collection() {
        this.entities = [];
    }
    Collection.prototype.add = function (entity) {
        this.entities[entity.id] = entity;
        return this;
    };
    Collection.prototype.getEntity = function (entity) {
        return this.entities[entity.id];
    };
    Collection.prototype.unset = function (entity) {
        delete this.entities[entity.id];
        return this;
    };
    Collection.prototype.forEach = function (callback) {
        for (var item in this.entities) {
            callback(this.entities[item], item);
        }
    };
    return Collection;
})();
var TargetsCollection = (function (_super) {
    __extends(TargetsCollection, _super);
    function TargetsCollection() {
        _super.apply(this, arguments);
    }
    return TargetsCollection;
})(Collection);
var BulletsCollection = (function (_super) {
    __extends(BulletsCollection, _super);
    function BulletsCollection() {
        _super.apply(this, arguments);
    }
    return BulletsCollection;
})(Collection);
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
                step: 6,
            },
            bullet: {
                speed: 10
            },
            target: {
                speed: 1,
                often: 2
            }
        };
        _super.call(this, data);
        var canvas = new Canvas({
            width: 320,
            height: 480,
        });
        this.canvas = canvas;
        Game.cx = canvas;
        this.time = new Date();
        this.counter = this.time.getMilliseconds();
        this.K = {
            up: 38,
            left: 37,
            down: 40,
            right: 39,
            space: 32,
        };
        this.targets = new TargetsCollection();
        this.bullets = new BulletsCollection();
        this.score = 0;
        this.hits = 0;
        this.pass = 0;
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
        this.updateCounter()
            .setBorders()
            .updateGun()
            .updateBullets()
            .updateTargets();
        this.addTarget();
        //console.log(this.counter);
        this.updateScore()
            .fillInfo();
    };
    Game.prototype.updateCounter = function () {
        this.time = new Date();
        this.counter = this.time.getMilliseconds() / 100;
        return this;
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
        return this;
    };
    Game.prototype.updateBullets = function () {
        var _this = this;
        var cv = this.canvas;
        this.bullets.forEach(function (e, i) {
            if (e.y < 0)
                _this.bullets.unset(e);
            e.y -= _this.data.bullet.speed;
            cv.drawRect(e.x, e.y, e.width, e.height, e.color);
        });
        return this;
    };
    Game.prototype.updateTargets = function () {
        var _this = this;
        var cv = this.canvas;
        this.targets.forEach(function (e, i) {
            if (e.y > _this.canvas.data.height)
                _this.targets.unset(e);
            if (e.y > _this.canvas.data.height) {
                _this.pass += 1;
            }
            //
            _this.bullets.forEach(function (b, n) {
                var collision = e.detectCollision(b);
                if (collision) {
                    _this.targets.unset(e);
                    _this.bullets.unset(b);
                    _this.hits += 1;
                }
            });
            if (!window.pause)
                e.y += (_this.data.target.speed);
            cv.drawRect(e.x, e.y, e.width, e.height, e.color);
        });
        return this;
    };
    Game.prototype.updateScore = function () {
        this.score = this.hits - this.pass;
        return this;
    };
    Game.prototype.addTarget = function () {
        if (window.pause || this.counter < 9.8) {
            return;
        }
        var x = this.getBetweenRandom();
        var y = 0;
        var t = new Target(x, y);
        //fix when target ot of the field
        if ((t.x + t.width) >= this.rightBorder) {
            //let move = t.x + t.width - this.rightBorder;
            //t.x -= move;
            //console.log(this.rightBorder,t.id,t.x, t.x + t.width);
            return;
        }
        this.targets.add(t);
    };
    Game.prototype.pushBullet = function () {
        var x = this.data.gun.position;
        var y = this.canvas.data.height;
        var b = new Bullet(x, y);
        this.bullets.add(b);
        var cv = this.canvas;
        cv.drawRect(b.x, b.y, b.width, b.height, b.color);
    };
    Game.prototype.handlers = function () {
        var _this = this;
        document.addEventListener('keydown', function (e) {
            console.log(e);
            var key = e.keyCode;
            var step = _this.data.gun.step;
            if (key == _this.K.left)
                _this.data.gun.position -= step;
            if (key == _this.K.right)
                _this.data.gun.position += step;
            if (key == _this.K.space)
                _this.pushBullet();
        }, true);
        document.addEventListener('click', function (e) {
            _this.pushBullet();
        }, true);
        window.addEventListener("deviceorientation", function (event) {
            if (window.DeviceOrientationEvent) {
                try {
                    _this.deviceMovementDirection(event);
                }
                catch (e) { }
            }
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
        var dir = null;
        if (beta > 45 && beta < 135) {
            dir = this.deviceDirectionBy(gamma);
        }
        else {
            var invert = alpha * -1;
            dir = this.deviceDirectionBy(invert);
        }
        if (dir == null)
            return;
        if (dir) {
            this.data.gun.position += step;
        }
        else {
            this.data.gun.position -= step;
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
            if (axis == device.changeMin)
                return null;
            r = axis > device.changeMin;
            device.changeMin = axis;
        }
        else {
            device.changeMin = 0;
            if (axis == device.changePlu)
                return null;
            r = axis > device.changePlu;
            device.changePlu = axis;
        }
        return r;
    };
    Game.prototype.getBetweenRandom = function () {
        var right = this.rightBorder;
        var left = this.leftBorder;
        return Math.floor((Math.random() * right) + left);
        ;
    };
    Game.prototype.fillInfo = function () {
        try {
            var el = document.getElementById('info');
            el.innerHTML = "SCORE: " + this.score + "\nhits: " + this.hits + "\npassed: " + this.pass;
        }
        catch (e) { }
        return this;
    };
    Game.prototype.init = function () {
        this.renderFrame();
        this.handlers();
        this.animate();
        console.log(this);
    };
    return Game;
})(Abstract);
var game = new Game();
game.init();
//# sourceMappingURL=init.js.map