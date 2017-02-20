class Entity {
    id:string;
    x:number;
    y:number;
    width:number;
    height:number;
    color:string;

    constructor(
        x:number,
        y:number,
        width?:number,
        height?:number,
        color?:string
    ) {
        this.id = guid();
        this.x = x;
        this.y = y;
        this.height = height || 10;
        this.width = width || 10;
        this.color = color || '#ff00';
    }

}