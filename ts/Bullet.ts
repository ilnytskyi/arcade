class Bullet  extends Entity {

    constructor(x:number,y:number,width:number,height:number,color:string){
        super(x,y,width,height,color);
        this.width = width || 5;
        this.height = height || 5;
        this.color = color || '#f00'
    }
}