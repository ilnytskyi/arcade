class Game extends Abstract {
    canvas:Canvas;
    targets:TargetsCollection;
    bullets:BulletsCollection;
    leftBorder:number;
    rightBorder:number;
    time:Date;
    counter:number;
    K:Object;
    static cx:Canvas;
    score:number;
    hits:number;
    pass:number;

    constructor(data:Object) {
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
        super(data);
        let canvas = new Canvas({
            width: 320,
            height: 465,
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

    renderFrame() {
        let cv = this.canvas;
        cv.clear();
        this.setBorders()
            .setGun();
    }

    updateFrame() {
        let cv = this.canvas;
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
    }

    updateCounter() {
        this.time = new Date();
        this.counter = this.time.getMilliseconds() / 100;
        return this;
    }

    setBorders() {
        let cv = this.canvas;
        cv.drawRect(
            this.data.padding,
            0,
            this.data.borders,
            cv.data.height,
            '#000'
        );

        let right = cv.data.width - this.data.padding - this.data.borders;
        cv.drawRect(
            right,
            0,
            this.data.borders,
            cv.data.height,
            '#000'
        );

        this.leftBorder = this.data.padding + this.data.borders;
        this.rightBorder = right;

        return this;
    }

    setGun() {
        let cv = this.canvas;
        let between = this.rightBorder - this.leftBorder;
        let position = (between / 2);
        this.data.gun.position = position;
        cv.drawRect(
            position,
            cv.data.height - this.data.padding,
            this.data.gun.width,
            this.data.gun.height,
            '#000'
        );

        return this;
    }

    updateGun() {
        let cv = this.canvas;
        let between = this.rightBorder - this.leftBorder;
        let position = this.data.gun.position;

        if (position <= this.leftBorder) position = this.leftBorder;
        let rightLimit = this.rightBorder - this.data.gun.width;
        if (position >= rightLimit) position = rightLimit;
        this.data.gun.position = position;

        cv.drawRect(
            position,
            cv.data.height - this.data.padding,
            this.data.gun.width,
            this.data.gun.height,
            '#000'
        );
        return this;
    }

    updateBullets() {
        let cv = this.canvas;
        this.bullets.forEach((e,i) => {

            if (e.y < 0) this.bullets.unset(e);

            e.y -= this.data.bullet.speed;

            cv.drawRect(
                e.x,
                e.y,
                e.width,
                e.height,
                e.color
            );
        });

        return this;
    }

    updateTargets() {
        let cv = this.canvas;
        this.targets.forEach((e,i) => {

            if (e.y > this.canvas.data.height) this.targets.unset(e);
            if (e.y > this.canvas.data.height) {
                this.pass += 1;
            }
            //
            this.bullets.forEach((b,n) => {
                let collision = e.detectCollision(b);
                if (collision) {
                    this.targets.unset(e);
                    this.bullets.unset(b);
                    this.hits += 1;
                }
            });

            if (!window.pause)
            e.y += ( this.data.target.speed );

            cv.drawRect(
                e.x,
                e.y,
                e.width,
                e.height,
                e.color
            );
        });

        return this;
    }

    updateScore() {
        this.score = this.hits - this.pass;
        return this;
    }

    addTarget() {

        if ( window.pause || this.counter < 9.8) {
            return;
        }

        let x = this.getBetweenRandom();
        let y = 0;
        let t = new Target(x,y);

        //fix when target ot of the field
        if ((t.x + t.width) >= this.rightBorder) {
            //let move = t.x + t.width - this.rightBorder;
            //t.x -= move;
            //console.log(this.rightBorder,t.id,t.x, t.x + t.width);
            return;
        }
        this.targets.add( t );
    }

    pushBullet() {
        let x = this.data.gun.position;
        let y = this.canvas.data.height;
        let b = new Bullet(x,y);
        this.bullets.add( b );

        let cv = this.canvas;
        cv.drawRect(
            b.x,
            b.y,
            b.width,b.height,b.color
        );
    }

    handlers() {
        document.addEventListener('keydown', (e) => {
            console.log(e);
            let key = e.keyCode;
            let step = this.data.gun.step;

            if (key == this.K.left) this.data.gun.position -= step;
            if (key == this.K.right) this.data.gun.position += step;

            if (key == this.K.space) this.pushBullet();

        }, false);

        //document.addEventListener('click', (e) => {
        //     this.pushBullet();
        //}, true);

        document.addEventListener('touchstart', (e) => {
             this.pushBullet();
        }, false);

        window.addEventListener("deviceorientation", (event) => {
            if ( window.DeviceOrientationEvent )
            {
             try {
                 this.deviceMovementDirection(event);
             } catch (e){}
            }

        }, false);

        document.addEventListener('touchmove', (e) => {
            e.preventDefault();
            this.pushBullet();
        }, false);
    }

    deviceMovementDirection(event:DeviceOrientationEvent) {
        window.device = window.device || {};
        window.device.changeMin = window.device.changeMin || 0;
        window.device.changePlu = window.device.changePlu || 0;

        let alpha = event.alpha.toFixed(0) * 1;
        let beta = event.beta.toFixed(0) * 1;
        let gamma = event.gamma.toFixed(0) * 1;


        let step = this.data.gun.step;

        let dir = null;
        if (beta > 45 && beta < 135) {
            dir = this.deviceDirectionBy(gamma);
        } else {
            let invert = alpha * -1;
            dir = this.deviceDirectionBy(invert);
        }
        if (dir == null) return;

        if (dir) {
            this.data.gun.position += step;
        } else  {
            this.data.gun.position -= step;
        }

        let v = {
            alpha: alpha,
            beta: beta,
            gamma: gamma
        };
        document.getElementById('debug').innerHTML = JSON.stringify(v) + "\n\n" + dir;

    }

    private deviceDirectionBy(axis:number) {
        let r = null;

        if (axis == 0) return null;

        if (axis < 0) {

            device.changePlu = 0;

            if (axis == device.changeMin) return null;

            r = axis > device.changeMin;

            device.changeMin = axis;


        } else {

            device.changeMin = 0;

            if (axis == device.changePlu) return null;

            r = axis > device.changePlu;

            device.changePlu = axis;

        }
        return r;
    }

    private getBetweenRandom() {
        let right = this.rightBorder;
        let left = this.leftBorder;

        return Math.floor((Math.random() * right) + left); ;
    }

    fillInfo()
    {
        try {
            let el = document.getElementById('info');
            el.innerHTML = "SCORE: " + this.score + "\nhits: " + this.hits + "\npassed: " + this.pass;
        } catch(e) {}

        return this;
    }

    public animate = () => {
        let requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
            window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
        this.time = new Date();
        this.updateFrame();
        requestAnimationFrame(this.animate);
    }

    init() {
        this.renderFrame();
        this.handlers();
        this.animate();
        console.log(this);
    }

}