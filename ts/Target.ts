class Target {
    width:number;
    height:number;
    x:number;
    y:number;
    color:string;

    constructor(x:number,y:number,width:number,height:number,color:string){

        this.width = width || 10;
        this.height = height || 10;
        this.x = x;
        this.y = y;
        this.color = color || '#d49661'
    }
}