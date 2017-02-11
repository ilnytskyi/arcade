abstract class Abstract
{
    data:Object;

    constructor(data:Object) {
        this.setCustomData(data);
    }

    setCustomData(data:Object) {
        for (var item in data) {
            this.data[item] = data[item];
        }
    }
}