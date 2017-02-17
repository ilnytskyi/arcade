class TargetsCollection {
    targets:Array;

    constructor(){
        this.targets = [];
    }

    add(target:Target){
        this.targets[target.id] = target;
        return this;
    }

    getTarget(target:Target)
    {
        return this.targets[target.id];
    }

    unset(target:Target)
    {
        delete this.targets[target.id];
        return this;
    }


}