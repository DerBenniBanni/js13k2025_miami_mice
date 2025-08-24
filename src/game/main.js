import { Game } from "./lib/game.js";
import { Cat, POSE_BOW, POSE_KICK, POSE_PUNCH, POSE_PUNCH2, POSE_STAND, POSE_WALK_1, POSE_WALK_2 } from "./lib/cat.js";
import { Player } from "./lib/player.js";

import musicGame from "./lib/soundbox/music_game.js";


window.game = null;
document.addEventListener("DOMContentLoaded", () => {
    game = new Game("gameCanvas");
    
    game.sfxPlayer.add("gamemusic", musicGame, true);

    //game.start();
    game.sfxPlayer.playAudio("gamemusic");

    
    
    let water = document.querySelector('.water');
    for(let y = 0; y < 45; y++) {
        let wave = water.cloneNode(true);
        wave.firstElementChild.style.animationDuration = (2 + Math.random() * 2) + 's';
        wave.style.top = `${y * 0.5 + 32}vh`;
        let gradScale = 0.7 - (y / 90);
        let gradient = 'repeating-linear-gradient(90deg, transparent 0, #fff1 40px, #fff1 45px, transparent 80px)';
        gradient += `,linear-gradient(90deg, #54f ${50-gradScale *25}%, #f47 ${50-gradScale * 15}%, #ff4 ${50-gradScale * 5}%, #ff4 ${50+gradScale * 5}%, #f47 ${50+gradScale * 15}%, #54f ${50+gradScale * 25}%)`;
        wave.firstElementChild.style.background = gradient;
        document.body.insertBefore(wave, water);
    }
    water.remove();
});