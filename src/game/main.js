import { Game } from "./lib/game.js";
import { CatKinematics } from "./lib/kinematics/cat.js";
import { toRad } from "./lib/utils.js";


window.game = null;
document.addEventListener("DOMContentLoaded", () => {
    game = new Game("gameCanvas");
    game.start();

    let cat1 = new CatKinematics(100, 200);
    let cat2 = new CatKinematics(250, 200);
    let cat3 = new CatKinematics(400, 200);
    let cat4 = new CatKinematics(550, 200);
    game.gameObjects.push(cat1);
    game.gameObjects.push(cat2);
    game.gameObjects.push(cat3);
    game.gameObjects.push(cat4);

    //cat1.morph("kick",0.3);
    cat3.pose("kick");
    cat4.pose("punch");

    window.setInterval(()=>{
        window.setTimeout(()=>{cat1.morph("kick",0.2)},100);
        window.setTimeout(()=>{cat1.morph("punch",0.2)},500);
        window.setTimeout(()=>{cat1.morph("stand",0.4)},900);
    }, 2000);
    //game.gameObjects.push(new Bone(100, 100, 100, Math.PI / 4));
});