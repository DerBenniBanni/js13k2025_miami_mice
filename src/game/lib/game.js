import { Cat } from "./cat.js";
import { POSE_STAND, POSE_WALK_1, POSE_WALK_2 } from "./kinematics.js";
import { Player } from "./player.js";
import { Rat } from "./rat.js";
import { RatKing } from "./ratking.js";
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

const SCENE_INTRO = 0;
const SCENE_STAGE = 1;
const SCENES = [];
SCENES[SCENE_INTRO] = (game) => {

    let cat = game.addGameObject(new Cat(-200, 900));
    cat.giColors = ['#fff', '#777'];
    let ratking = game.addGameObject(new RatKing(2100, 800));
    ratking.walkSpeed = 200;
    //let rat1 = game.addGameObject(new Rat(2200, 700));
    //rat1.walkSpeed = 300;
    //let rat2 = game.addGameObject(new Rat(2200, 1000));
    //rat2.walkSpeed = 300;
    
    game.cutscene = [
        (game) => {
            
            ratking.kiTarget = {x:1400, y:880};
            ratking.kiTargetReached = () => {
                ratking.kiTargetReached = null;
                game.nextCutscene();
            };
            //rat1.kiTarget = {x:1700, y:700};
            //rat2.kiTarget = {x:1700, y:1050};
            cat.walkSpeed = 300;
            cat.kiTarget = {x:400, y:900};
        },
        (game) => {
            game.texts = [
                {
                    text: "RAT KING: <br>Agent Furball! Finally, we meet in person.<br>So, the Feline Bureau of Investigation has come to play!<br><br>This is my city!<br>Stay out of my way!", 
                    align:"right"
                }
            ];
            game.nextText();
            game.cutsceneCallback = (game) => {
                game.nextCutscene();
            };
        },
        (game) => {
            game.texts = [
                {
                    text: "Special Agent KUNG FURBALL:<br>You may have the police in your pocket.<br> But I am the law!<br>The Feline Bureau of Investigation will bring you to justice!", 
                    align:"left"
                }
            ];
            game.nextText();
            game.cutsceneCallback = (game) => {  
                game.nextCutscene();
            };
        },
        (game) => {
            game.nextText();
            ratking.queueMorph(POSE_WALK_2, 0.2, true);
            ratking.kiTarget = {x:2300, y:900};
            ratking.kiTargetReached = () => {
                ratking.kiTargetReached = null;
                game.initObjects(SCENE_STAGE);
            };
            //rat1.kiTarget = {x:2400, y:700};
            //rat2.kiTarget = {x:2400, y:1200};
            cat.kiTarget = {x:-400, y:900};
            cat.queueMorph(POSE_WALK_2, 0.2, true);
        }
    ];
    game.nextCutscene();
};

SCENES[SCENE_STAGE] = (game) => {
    game.gameObjects = [];
    let player = game.addGameObject(new Player(400, 900, 1));
    player.giColors = ['#fff', '#777'];
    let rat = game.addGameObject(new Rat(1800, 900));
};


export class Game {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext("2d");
        this.isGameRunning = false;
        this.gameObjects = [];
        this.enemies = []; // cache for enemy objects
        this.lastUpdateTime = 0;

        this.texts = [];
        this.txtPointer = -1;

        this.sfxPlayer = new SFXPlayer(); // Sound effect player

        this.cutscene = [];
        this.cutsceneCallback = null;
        this.cutsceneSkip = 1;
        this.cutsceneRunning = false;

        this.keys = {};
        this.actions = [];
        window.addEventListener("keydown", (e) => {
            if(e.code in keyActionMap) e.preventDefault();
            this.keys[e.code] = true;
            this.actions[keyActionMap[e.code]] = 1;
        });
        window.addEventListener("keyup", (e) => {
            if(e.code in keyActionMap) e.preventDefault();
            this.keys[e.code] = false;
            this.actions[keyActionMap[e.code]] = 0;
        });
    }

    nextCutscene() {
        this.cutsceneCallback = null;
        this.txtPointer = -1
        this.cutsceneSkip = 1;
        this.texts = [];
        this.clearText();
        if (this.cutscene.length > 0) {
            this.cutscene.shift()(this);
            this.cutsceneRunning = true;
        }
    }

    nextText() {
        let txt = document.querySelector('.txt');
        if (this.txtPointer < this.texts.length - 1) {
            this.txtPointer++;
            txt.innerHTML = this.texts[this.txtPointer].text;
            txt.style.textAlign = this.texts[this.txtPointer].align || "center";
        } else {
            txt.innerHTML = "";
        }
    }
    clearText() {
        let txt = document.querySelector('.txt');
        txt.innerHTML = "";
    }

    getActionState(action) {
        return this.actions[action] || 0;
    }

    addGameObject(obj) {
        obj.game = this;
        this.gameObjects.push(obj);
        return obj;
    }

    start(callback) {
        this.sfxPlayer.playAudio("gamemusic");
        document.querySelectorAll('.mainmenu,.neon,.cast').forEach(div=>div.style.opacity = 0);
        
        document.querySelector('.mainmenu').style.display = "none";
        document.querySelector('.bigtext').style.fontSize = "33vh";
        document.querySelector('.bigtext').style.opacity = "0";
        document.querySelector('.bigtext').style.top = "15vh";
        document.querySelector('.bigtext').style.zIndex = "20";
        this.isGameRunning = true;
        this.gameLoop();
        this.initObjects(SCENE_INTRO);  // SCENE_INTRO, SCENE_STAGE
    }

    initObjects(scene) {
        this.cutsceneRunning = false;
        SCENES[scene](this);
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
            this.checkGamepads();
            this.gameObjects.sort((a, b) => a.y - b.y);
            this.update(deltaTime);
            this.render();
            requestAnimationFrame(() => this.gameLoop());
        }
    }
    checkGamepads() {
        if(!navigator.getGamepads) return;
        let connected = navigator.getGamepads().filter(pad => pad);
        let pad1 = connected[0];
        if (pad1) {
            this.actions[ACTION_KICK_PLAYER_1] = pad1.buttons[0].pressed;
            this.actions[ACTION_PUNCH_PLAYER_1] = pad1.buttons[1].pressed;
            this.actions[ACTION_BLOCK_PLAYER_1] = pad1.buttons[2].pressed;
            this.actions[ACTION_MOVE_LEFT_PLAYER_1] = pad1.axes[0] < -0.2 ? pad1.axes[0]*-1 : 0;
            this.actions[ACTION_MOVE_RIGHT_PLAYER_1] = pad1.axes[0] > 0.2 ? pad1.axes[0] : 0;
            this.actions[ACTION_MOVE_UP_PLAYER_1] = pad1.axes[1] < -0.2 ? pad1.axes[1]*-1 : 0;
            this.actions[ACTION_MOVE_DOWN_PLAYER_1] = pad1.axes[1] > 0.2 ? pad1.axes[1] : 0;
        }
    }

    update(delta) {
        if(this.cutsceneCallback && this.cutsceneSkip < 0 && (
            this.actions[ACTION_KICK_PLAYER_1] || this.actions[ACTION_PUNCH_PLAYER_1] || this.actions[ACTION_BLOCK_PLAYER_1]
        )) {
            this.cutsceneCallback(this);
        };
        this.cutsceneSkip-=delta;
        this.enemies = this.getGameObjects(["rat"]).filter(rat => rat.hp > 0);
        this.gameObjects.forEach(obj => {
            obj.update(delta);
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