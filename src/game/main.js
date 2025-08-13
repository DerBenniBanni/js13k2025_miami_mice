import { Game } from "./lib/game.js";
import { CatKinematics } from "./lib/kinematics/cat.js";
import { toRad } from "./lib/utils.js";


window.game = null;
document.addEventListener("DOMContentLoaded", () => {
    game = new Game("gameCanvas");
    game.start();

    let cat1 = new CatKinematics(100, 200);
    let cat2 = new CatKinematics(300, 200);
    let cat3 = new CatKinematics(500, 200);
    game.gameObjects.push(cat1);
    game.gameObjects.push(cat2);
    game.gameObjects.push(cat3);

    cat2.findBone("leftArm").angle = toRad(15);
    cat2.findBone("leftForearm").angle = toRad(-10);
    cat2.findBone("leftUpperLeg").angle = toRad(70);
    cat2.findBone("leftLowerLeg").angle = toRad(40);
    cat2.findBone("rightUpperLeg").angle = toRad(110);
    cat2.update(); // Recalculate positions after changing angle
    
    
    cat3.findBone("leftUpperLeg").angle = toRad(-30);
    cat3.findBone("leftLowerLeg").angle = toRad(10);
    cat3.findBone("body").angle = toRad(-105);
    cat3.findBone("rightUpperLeg").angle = toRad(105);
    cat3.findBone("leftArm").angle = toRad(60);
    cat3.findBone("leftForearm").angle = toRad(-130);
    cat3.update(); // Recalculate positions after changing angle
    //game.gameObjects.push(new Bone(100, 100, 100, Math.PI / 4));
});