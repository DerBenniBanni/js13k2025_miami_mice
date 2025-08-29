import { Cat } from "./cat.js";
import { POSE_STAND } from "./kinematics.js";
import { Player } from "./player.js";
import { Rat } from "./rat.js";
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
        this.enemies = []; // cache for enemy objects
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
        /*
        let cat2 = this.addGameObject(new Cat(1200, 900));
        cat2.invertX = true;
        cat2.giColors = ['#d00', '#600'];
        cat2.pose(POSE_STAND);
        */
        let rat = this.addGameObject(new Rat(710, 900));
        //rat.state = 6;
        let rat2 = this.addGameObject(new Rat(715, 900));
        let rat3 = this.addGameObject(new Rat(712, 900));
        //rat.invertX = true;
        /*
        let rat2 = this.addGameObject(new Rat(1000, 700));
        rat2.invertX = true;
        */
    }

    getGameObjects(types) {
        if (!types) {
            return this.gameObjects;
        }
        return this.gameObjects.filter(obj => types.includes(obj.type));
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
        this.enemies = this.getGameObjects(["rat"]).filter(rat => rat.hp > 0);
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