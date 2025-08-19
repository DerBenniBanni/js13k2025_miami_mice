import { Game } from "./lib/game.js";
import { CatKinematics } from "./lib/kinematics/cat.js";
import { toRad } from "./lib/utils.js";


window.game = null;
document.addEventListener("DOMContentLoaded", () => {
    game = new Game("gameCanvas");
    game.start();

    let cat1 = new CatKinematics(600, 700);
    let cat2 = new CatKinematics(1200, 700);
    game.gameObjects.push(cat1);
    //game.gameObjects.push(cat2);
    cat2.pose("bow");
    /*
    let cat2 = new CatKinematics(250, 200);
    let cat3 = new CatKinematics(400, 200);
    let cat4 = new CatKinematics(550, 200);
    game.gameObjects.push(cat2);
    game.gameObjects.push(cat3);
    game.gameObjects.push(cat4);
    cat3.pose("kick");
    cat4.pose("punch");
    */
    

    window.setInterval(()=>{
        window.setTimeout(()=>{cat1.morph("bow",0.5)},10);
        window.setTimeout(()=>{cat1.morph("stand",0.5)},1000);
        window.setTimeout(()=>{cat1.morph("kick",0.2)},2100);
        window.setTimeout(()=>{cat1.morph("punch",0.1)},2500);
        window.setTimeout(()=>{cat1.morph("punch2",0.1)},2900);
        window.setTimeout(()=>{cat1.morph("stand",0.3)},3200);
    }, 5000);
    //game.gameObjects.push(new Bone(100, 100, 100, Math.PI / 4));
    
    let water = document.querySelector('.water');
    for(let y = 0; y < 45; y++) {
        let wave = water.cloneNode(true);
        wave.firstElementChild.style.animationDuration = (1 + Math.random() * 2) + 's';
        wave.style.top = `${y * 0.5 + 32}vh`;
        let gradScale = 0.7 - (y / 90);
        wave.firstElementChild.style.background = `linear-gradient(90deg, rgb(79, 70, 252) ${50-gradScale *25}%, rgb(252, 70, 107) ${50-gradScale * 15}%, rgb(234, 252, 70) ${50-gradScale * 5}%, rgb(234, 252, 70) ${50+gradScale * 5}%, rgb(252, 70, 107) ${50+gradScale * 15}%, rgb(79, 70, 252) ${50+gradScale * 25}%`;
        document.body.insertBefore(wave, water);
    }
    water.remove();
});