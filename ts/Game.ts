class Game {
    canvas:Object;
    config:Object;

    constructor(config:Object) {
        this.config = {
            id: 'grid',
            width: screen.width,
            height: screen.height,
        };
        this.setCustomConfig(config);
        this.setCanvas(this.config.id);
    }

    setCustomConfig(config:Object) {
        for (var item in config) {
            this.config[item] = config[item];
        }
    }
}