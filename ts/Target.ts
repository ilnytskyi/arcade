class Target  extends Entity {


    constructor(x:number,y:number,width:number,height:number,color:string){
        super(x,y,width,height,color);
        this.width = width || 15;
        this.height = height || 15;
        this.color = color || '#d49661'
    }
}