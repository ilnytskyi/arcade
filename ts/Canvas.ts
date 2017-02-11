class Canvas extends Abstract {
    cx:Element;

    constructor(data:Object) {
        super(data);

        this.data = {
            id: 'grid',
            width: screen.width,
            height: screen.height,
        };
        this.setCanvas(this.data.id);
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
