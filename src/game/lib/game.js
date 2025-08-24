import SFXPlayer from "./soundbox/sfxplayer.js";

export const ACTION_MOVE_LEFT_PLAYER_1 = 0;
export const ACTION_MOVE_RIGHT_PLAYER_1 = 1;
export const ACTION_MOVE_UP_PLAYER_1 = 2;
export const ACTION_MOVE_DOWN_PLAYER_1 = 3;

const keyActionMap = {
    "KeyA": ACTION_MOVE_LEFT_PLAYER_1,
    "KeyD": ACTION_MOVE_RIGHT_PLAYER_1,
    "KeyW": ACTION_MOVE_UP_PLAYER_1,
    "KeyS": ACTION_MOVE_DOWN_PLAYER_1
};

export class Game {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext("2d");
        this.isGameRunning = false;
        this.gameObjects = [];
        this.lastUpdateTime = 0;

        this.sfxPlayer = new SFXPlayer(); // Sound effect player

        this.keys = {};
        this.actions = [];
        window.addEventListener("keydown", (e) => {
            this.keys[e.code] = true;
            this.actions[keyActionMap[e.code]] = true;
        });
        window.addEventListener("keyup", (e) => {
            this.keys[e.code] = false;
            this.actions[keyActionMap[e.code]] = false;
        });
    }

    getActionState(action) {
        return this.actions[action] || false;
    }

    addGameObject(obj) {
        obj.game = this;
        this.gameObjects.push(obj);
        return obj;
    }

    start() {
        document.querySelectorAll('.mainmenu,.bigtext,.neon').forEach(div=>div.style.display='none');
        this.isGameRunning = true;
        this.gameLoop();
    }

    gameLoop() {
        if (!this.isGameRunning) return;

        const currentTime = performance.now();
        const deltaTime = (currentTime - this.lastUpdateTime) / 1000; // Convert to seconds
        this.lastUpdateTime = currentTime;

        if (this.isGameRunning) {
            this.gameObjects.sort((a, b) => a.y - b.y);
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