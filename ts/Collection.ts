abstract class Collection {
    entities:Array<Object>;

    constructor(){
        this.entities = [];
    }

    add(entity:Entity){
        this.entities[entity.id] = entity;
        return this;
    }

    getEntity(entity:Entity)
    {
        return this.entities[entity.id];
    }

    unset(entity:Entity)
    {
        delete this.entities[entity.id];
        return this;
    }

    forEach(callback) {
        for (let item in this.entities) {
            callback(this.entities[item],item);
        }
    }
}