export class Game {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext("2d");
        this.isGameRunning = false;
        this.gameObjects = [];
    }

    start() {
        this.isGameRunning = true;
        this.gameLoop();
    }

    gameLoop() {
        if (this.isGameRunning) {
            this.update();
            this.render();
            requestAnimationFrame(() => this.gameLoop());
        }
    }

    update() {
        // Update game logic here
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // Render game objects here
        this.gameObjects.forEach(obj => {
            obj.render(this.ctx);
        });
    }
}