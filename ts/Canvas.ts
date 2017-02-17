class Canvas extends Abstract {
    cx:CanvasRenderingContext2D;

    constructor(data:Object) {
        this.data = {
            id: 'grid',
            width: window.innerWidth,
            height: window.innerHeight,
        };
        super(data);

        this.setCanvas(this.data.id);
    }

    setCanvas(id:string) {
        var cx = document.getElementById(id);
        if (!cx) {
            let canvas = document.createElement('canvas');
            canvas.id = id;
            canvas.width = this.data.width;
            canvas.height = this.data.height;
            document.body.appendChild(canvas);
            cx = document.getElementById(id);
        }
        this.cx = cx.getContext('2d');
    }

    drawRect(x:number, y:number, width:number, height:number, color:string) {
        this.cx.beginPath();
        this.cx.fillStyle = color;
        this.cx.fillRect(x, y, width, height);
        this.cx.closePath();
        return this;
    }

    clear()
    {
        this.cx.clearRect(0,0,this.data.width,this.data.height);
        return this;
    }

}
