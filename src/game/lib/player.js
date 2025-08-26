import { Cat } from "./cat.js";
import { POSE_BLOCK, POSE_KICK, POSE_PUNCH, POSE_PUNCH2, POSE_STAND, POSE_WALK_1, POSE_WALK_2, STATE_BLOCK, STATE_IDLE, STATE_KICK, STATE_PUNCH, STATE_WALKING } from "./kinematics.js";
import { ACTION_MOVE_LEFT_PLAYER_1, ACTION_MOVE_RIGHT_PLAYER_1,ACTION_MOVE_UP_PLAYER_1, ACTION_MOVE_DOWN_PLAYER_1, ACTION_BLOCK_PLAYER_1, ACTION_KICK_PLAYER_1, ACTION_PUNCH_PLAYER_1 } from "./game.js";

export class Player extends Cat {
    constructor(x, y, playerNumber) {
        super(x,y);
        this.playerNumber = playerNumber;
        this.score = 0;
        this.walkSpeed = 250;
    }

    incrementScore() {
        this.score++;
    }

    update(deltaTime) {
        let previousState = this.state;
        let noInput = true;
        let moveAllowed = true;
        if (this.game.getActionState(ACTION_KICK_PLAYER_1)) {
            this.state = STATE_KICK;
            if(previousState != STATE_KICK) {
                this.queueMorph(POSE_KICK, 0.1, true);
            }
            noInput = false;
            moveAllowed = false;
        }
        if (this.game.getActionState(ACTION_PUNCH_PLAYER_1)) {
            this.state = STATE_PUNCH;
            if(previousState != STATE_PUNCH) {
                let pose = this.lastPunch == 1 ? POSE_PUNCH2 : POSE_PUNCH;
                this.queueMorph(pose, 0.1, true);
            }
            noInput = false;
            moveAllowed = false;
        }
        if(noInput && this.game.getActionState(ACTION_BLOCK_PLAYER_1)) {
            this.state = STATE_BLOCK;
            if(previousState != STATE_BLOCK) {
                this.queueMorph(POSE_BLOCK, 0.1, true);
            }
            noInput = false;
            moveAllowed = false;
        }
        if (moveAllowed && this.game.getActionState(ACTION_MOVE_LEFT_PLAYER_1)) {
            this.x -= this.walkSpeed * deltaTime;
            this.state = STATE_WALKING;
            noInput = false;
            this.invertX = true
        }
        if (moveAllowed && this.game.getActionState(ACTION_MOVE_RIGHT_PLAYER_1)) {
            this.x += this.walkSpeed * deltaTime;
            this.state = STATE_WALKING;
            noInput = false;
            this.invertX = false;
        }
        if (moveAllowed && this.game.getActionState(ACTION_MOVE_UP_PLAYER_1)) {
            this.y -= this.walkSpeed*0.8 * deltaTime;
            this.updateSizing();
            this.state = STATE_WALKING;
            noInput = false;
        }
        if (moveAllowed && this.game.getActionState(ACTION_MOVE_DOWN_PLAYER_1)) {
            this.y += this.walkSpeed*0.8 * deltaTime;
            this.updateSizing();
            this.state = STATE_WALKING;
            noInput = false;
        }
        
        if (noInput) {
            this.state = STATE_IDLE;
            if(previousState !== STATE_IDLE) {
                this.queueMorph(POSE_STAND, 0.2, true);
            }
        } else {
            if(this.state === STATE_WALKING && previousState !== STATE_WALKING) {
                this.queueMorph(POSE_WALK_2, 100 / this.walkSpeed, true);
            }
        }
        
        super.update(deltaTime);
    }
}
