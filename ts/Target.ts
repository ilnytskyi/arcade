class Target  extends Entity {


    constructor(x:number,y:number,width:number,height:number,color:string){
        super(x,y,width,height,color);
        this.width = width || 10;
        this.height = height || 10;
        this.color = color || '#d49661'
    }
}