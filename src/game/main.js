import { Game } from "./lib/game.js";
import { Cat, POSE_BOW, POSE_KICK, POSE_PUNCH, POSE_PUNCH2, POSE_STAND, POSE_WALK_1, POSE_WALK_2 } from "./lib/cat.js";
import { Player } from "./lib/player.js";

import musicGame from "./lib/soundbox/music_game.js";


window.game = null;
document.addEventListener("DOMContentLoaded", () => {
    game = new Game("gameCanvas");
    
    //game.sfxPlayer.add("gamemusic", musicGame, true);

    //game.start();
    //game.sfxPlayer.playAudio("gamemusic");

    let cat1 = game.addGameObject(new Player(800, 900, 1));
    cat1.giColors = ['#fff', '#777'];
    let cat2 = game.addGameObject(new Cat(1200, 900));
    cat2.invertX = true;
    cat2.giColors = ['#d00', '#600'];
    game.gameObjects.push(cat1);
    game.gameObjects.push(cat2);
    cat2.pose("stand");


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

    /* 
    cat1.queueMorph(null, 1);
    cat1.queueMorph(POSE_BOW, 1);
    cat1.queueMorph(null, 1);
    cat1.queueMorph(POSE_STAND, 0.5);
    cat1.queueMorph(null, 1);
    cat1.queueMorph(POSE_KICK, 0.2);
    cat1.queueMorph(null, 0.5);
    cat1.queueMorph(POSE_PUNCH2, 0.3);
    cat1.queueMorph(null, 0.2);
    cat1.queueMorph(POSE_PUNCH, 0.3);
    cat1.queueMorph(null, 0.5);
    cat1.queueMorph(POSE_STAND, 0.5);

    cat1.queueMorph(POSE_WALK_1, 1, true);
    cat1.queueMorph(POSE_WALK_2, 1);
    cat1.queueMorph(POSE_WALK_1, 1);
    cat1.queueMorph(POSE_WALK_2, 1);
    cat1.queueMorph(POSE_WALK_1, 1);
    cat1.queueMorph(POSE_WALK_2, 1);
    cat1.queueMorph(POSE_WALK_1, 1);
    cat1.queueMorph(POSE_WALK_2, 1);
    */

    /*
    window.setInterval(()=>{
        window.setTimeout(()=>{cat1.morph("bow",0.5)},10);
        window.setTimeout(()=>{cat1.morph("stand",0.5)},1100);
        window.setTimeout(()=>{cat1.morph("kick",0.2)},2100);
        window.setTimeout(()=>{cat1.morph("punch",0.1)},2500);
        window.setTimeout(()=>{cat1.morph("punch2",0.1)},2900);
        window.setTimeout(()=>{cat1.morph("stand",0.3)},3200);
        
        window.setTimeout(()=>{cat2.morph("bow",0.5)},90);
        window.setTimeout(()=>{cat2.morph("stand",0.5)},1000);
        window.setTimeout(()=>{cat2.morph("punch2",0.2)},1900);
        window.setTimeout(()=>{cat2.morph("kick",0.1)},2300);
        window.setTimeout(()=>{cat2.morph("punch",0.1)},3100);
        window.setTimeout(()=>{cat2.morph("stand",0.3)},3800);
    }, 5000);
    */
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