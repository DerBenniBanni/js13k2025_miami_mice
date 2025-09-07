import { Cat } from "./cat.js";
import { POSE_WALK_2 } from "./kinematics.js";
import { Player } from "./player.js";
import { Rat } from "./rat.js";
import { RatKing } from "./ratking.js";

const add = (g, o) => g.addGameObject(o);

const setNextCutCb = (g) => {
    g.cutsceneCallback = (g) => {
        g.nextCutscene();
    };
};

const setSceneWonCallback = (g, n) => {
    g.sceneWonCallback = (g) => {
        let rats = g.getGameObjects(["rat"]);
        if(rats.length === 0) {
            g.initObjects(n);
        }
    };
};

export const SCENES = [];
SCENES[0] = (game) => {
    game.gameObjects = [];
    let cat = add(game, new Cat(-200, 900));
    cat.giColors = ['#fff', '#777'];

    let ratking = add(game, new RatKing(2100, 800));
    ratking.walkSpeed = 200;
    let rat1 = add(game, new Rat(2200, 700));
    rat1.walkSpeed = 300;
    let rat2 = add(game, new Rat(2200, 1000));
    rat2.walkSpeed = 300;
    
    game.cutscene = [
        (game) => {
            
            ratking.kiTarget = {x:1400, y:880};
            ratking.kiTargetReached = () => {
                ratking.kiTargetReached = null;
                game.nextCutscene();
            };
            rat1.kiTarget = {x:1700, y:700};
            rat2.kiTarget = {x:1700, y:1050};
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
            setNextCutCb(game);
        },
        (game) => {
            game.texts = [
                {
                    text: "Special Agent KUNG FURBALL:<br>You may have the police in your pocket.<br> But I am the law!<br>The Feline Bureau of Investigation will bring you to justice!", 
                    align:"left"
                }
            ];
            game.nextText();
            setNextCutCb(game);
        },
        (game) => {
            game.nextText();
            ratking.queueMorph(POSE_WALK_2, 0.2, true);
            ratking.kiTarget = {x:2300, y:900};
            ratking.kiTargetReached = () => {
                ratking.kiTargetReached = null;
                game.initObjects(1); // Start main game
            };
            rat1.kiTarget = {x:2400, y:700};
            rat2.kiTarget = {x:2400, y:1200};
            cat.kiTarget = {x:-400, y:900};
            cat.queueMorph(POSE_WALK_2, 0.2, true);
        }
    ];
    game.nextCutscene();
};

SCENES[1] = (game) => {
    game.gameObjects = [];
    let player = add(game, new Player(400, 900, 1));
    player.giColors = ['#fff', '#777'];
    let rat = add(game, new Rat(1800, 900));
    setSceneWonCallback(game, 2);
};

SCENES[2] = (game) => {
    game.gameObjects = [];
    let player = add(game, new Player(900, 900, 1));
    player.giColors = ['#fff', '#777'];
    add(game, new Rat(1800, 800));
    add(game, new Rat(1900, 1000));
    add(game, new Rat(100, 800));
    add(game, new Rat(200, 1000));
    setSceneWonCallback(game, 3);
};

SCENES[3] = (game) => {
    game.gameObjects = [];
    let cat = add(game, new Cat(200, 900));
    cat.giColors = ['#fff', '#777'];

    let ratking = add(game, new RatKing(2100, 1050));
    ratking.walkSpeed = 200;
    let rat2 = add(game, new Rat(2200, 900));
    rat2.walkSpeed = 300;
    
    game.cutscene = [
        (game) => {
            
            ratking.kiTarget = {x:1400, y:1050};
            ratking.kiTargetReached = () => {
                ratking.kiTargetReached = null;
                game.nextCutscene();
            };
        },
        (game) => {
            game.texts = [
                {
                    text: "RAT KING: <br>So, Master Splinter the traitor sends his best?<br>Hah! You are no match for me, cat!", 
                    align:"right"
                }
            ];
            game.nextText();
            setNextCutCb(game);
        },
        (game) => {
            game.texts = [
                {
                    text: "RAT KING:<br>May I intoduce you to my best cheese thrower?<br>Il grande Alonzo Padano! <br>Prepare to meet your cheesy doom, kitty!",
                    align:"right"
                }
            ];
            game.nextText();
            setNextCutCb(game);
            rat2.kiTarget = {x:1700, y:900};
        },
        (game) => {
            game.nextText();
            ratking.queueMorph(POSE_WALK_2, 0.2, true);
            ratking.kiTarget = {x:2300, y:1050};
            ratking.kiTargetReached = () => {
                ratking.kiTargetReached = null;
                game.initObjects(4); 
            };
        }
    ];
    game.nextCutscene();
};

SCENES[4] = (game) => {
    game.gameObjects = [];
    let player = add(game, new Player(400, 900, 1));
    player.giColors = ['#fff', '#777'];
    add(game, new Rat(1800, 800));
    let rat = add(game, new Rat(1700, 900));
    rat.isThrower = true;
    setSceneWonCallback(game, 4);
};

