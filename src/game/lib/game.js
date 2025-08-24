import { Cat, POSE_BLOCK, POSE_BOW, POSE_KICK, POSE_PUNCH, POSE_PUNCH2, POSE_STAND } from "./cat.js";
import { Player } from "./player.js";
import SFXPlayer from "./soundbox/sfxplayer.js";

export const ACTION_MOVE_LEFT_PLAYER_1 = 0;
export const ACTION_MOVE_RIGHT_PLAYER_1 = 1;
export const ACTION_MOVE_UP_PLAYER_1 = 2;
export const ACTION_MOVE_DOWN_PLAYER_1 = 3;
export const ACTION_BLOCK_PLAYER_1 = 4;
export const ACTION_PUNCH_PLAYER_1 = 5;
export const ACTION_KICK_PLAYER_1 = 6;

const keyActionMap = {
    "KeyA": ACTION_MOVE_LEFT_PLAYER_1,
    "KeyD": ACTION_MOVE_RIGHT_PLAYER_1,
    "KeyW": ACTION_MOVE_UP_PLAYER_1,
    "KeyS": ACTION_MOVE_DOWN_PLAYER_1,
    "KeyB": ACTION_BLOCK_PLAYER_1,
    "KeyH": ACTION_PUNCH_PLAYER_1,
    "KeyJ": ACTION_KICK_PLAYER_1
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
            if(e.code in keyActionMap) e.preventDefault();
            this.keys[e.code] = true;
            this.actions[keyActionMap[e.code]] = true;
        });
        window.addEventListener("keyup", (e) => {
            if(e.code in keyActionMap) e.preventDefault();
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

    start(callback) {
        document.querySelectorAll('.mainmenu,.bigtext,.neon,.cast').forEach(div=>div.style.display='none');
        this.isGameRunning = true;
        this.gameLoop();
        this.initObjects()
    }
    initObjects() {
        let cat1 = this.addGameObject(new Player(300, 900, 1));
        cat1.giColors = ['#fff', '#777'];
        let cat2 = this.addGameObject(new Cat(1200, 900));
        cat2.invertX = true;
        cat2.giColors = ['#d00', '#600'];
        this.gameObjects.push(cat1);
        this.gameObjects.push(cat2);
        cat2.pose(POSE_STAND);

/*
        let foo = ()=> {
            cat2.queueMorph(null, 1);
            cat2.queueMorph(POSE_BOW, 1);
            cat2.queueMorph(null, 1);
            cat2.queueMorph(POSE_STAND, 0.5);
            cat2.queueMorph(null, 1);
            cat2.queueMorph(POSE_KICK, 0.2);
            cat2.queueMorph(null, 0.5);
            cat2.queueMorph(POSE_PUNCH2, 0.3);
            cat2.queueMorph(null, 0.2);
            cat2.queueMorph(POSE_PUNCH, 0.3);
            cat2.queueMorph(null, 0.5);
            cat2.queueMorph(POSE_STAND, 0.5);
        }
        foo();
        window.setInterval(foo, 7200);
        */
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