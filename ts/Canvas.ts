class Canvas {
    cx:Element;
    config:Object;

    constructor(config:Object) {
        this.config = {
            id: 'grid',
            width: screen.width,
            height: screen.height,
        };
        this.setCustomConfig(config);
        this.setCanvas(this.config.id);
    }

    setCustomConfig(config:Object) {
        for (var item in config) {
            this.config[item] = config[item];
        }
    }

    setCanvas(id:string) {
        var cx = document.getElementById(id);
        if (!cx) {
            let canvas = document.createElement('canvas');
            canvas.id = id;
            canvas.width = this.config.width;
            canvas.height = this.config.height;
            document.body.appendChild(canvas);
            cx = document.getElementById(id);
        }
        this.cx = cx.getContext('2d');
    }

}
