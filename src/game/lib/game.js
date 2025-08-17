export class Game {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext("2d");
        this.isGameRunning = false;
        this.gameObjects = [];
        this.lastUpdateTime = 0;

    }

    start() {
        this.isGameRunning = true;
        this.gameLoop();
    }

    gameLoop() {
        if (!this.isGameRunning) return;

        const currentTime = performance.now();
        const deltaTime = (currentTime - this.lastUpdateTime) / 1000; // Convert to seconds
        this.lastUpdateTime = currentTime;

        if (this.isGameRunning) {
            this.update(deltaTime);
            this.render();
            requestAnimationFrame(() => this.gameLoop());
        }
    }

    update(deltaTime) {
        this.gameObjects.forEach(obj => {
            obj.update(deltaTime);
        });
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // Render game objects here
        this.gameObjects.forEach(obj => {
            obj.render(this.ctx);
        });
    }
}