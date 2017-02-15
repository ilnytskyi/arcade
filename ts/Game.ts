class Game extends Abstract {
    canvas:Canvas;
    targets:TargetsCollection;
    leftBorder:number;
    rightBorder:number;
    time:Object;
    K:Object;

    constructor(data:Object) {
        this.data = {
            padding: 10,
            borders: 5,
            gun: {
                width: 15,
                height: 5,
                step:5,
            }
        }
        super(data);
        let canvas = new Canvas({
            width: 360,
            height: 650,
        });
        this.canvas = canvas;
        this.time = new Date();
        this.K = {
            up: 38,
            left: 37,
            down: 40,
            right: 39,
            space: 32,
        }
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
        this.setBorders()
            .updateGun();
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
    }

    handlers(){
        document.addEventListener('keydown',(e) => {
            let key = e.keyCode;
            let step = this.data.gun.step;

            if (key == this.K.left) this.data.gun.position -= step;
            if (key == this.K.right) this.data.gun.position += step;


        },false);
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