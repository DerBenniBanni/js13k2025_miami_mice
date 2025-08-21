import { Cat, POSE_STAND, POSE_WALK_1, POSE_WALK_2, STATE_IDLE, STATE_WALKING } from "./cat.js";
import { ACTION_MOVE_LEFT_PLAYER_1, ACTION_MOVE_RIGHT_PLAYER_1 } from "./game.js";

export class Player extends Cat {
    constructor(x, y, playerNumber) {
        super(x,y);
        this.playerNumber = playerNumber;
        this.score = 0;
    }

    incrementScore() {
        this.score++;
    }

    update(deltaTime) {
        let previousState = this.state;
        let noInput = true;
        if (this.game.getActionState(ACTION_MOVE_LEFT_PLAYER_1)) {
            this.x -= 100 * deltaTime;
            this.state = STATE_WALKING;
            noInput = false;
        }
        if (this.game.getActionState(ACTION_MOVE_RIGHT_PLAYER_1)) {
            this.x += 100 * deltaTime;
            this.state = STATE_WALKING;
            noInput = false;
        }
        if (noInput) {
            this.state = STATE_IDLE;
            if(previousState !== STATE_IDLE) {
                console.log("Player " + this.playerNumber + " idle");
                this.queueMorph(POSE_STAND, 0.2, true);
            }
        } else {
            if(this.state === STATE_WALKING && previousState !== STATE_WALKING) {
                this.queueMorph(POSE_WALK_2, 1, true);
            }
        }
        super.update(deltaTime);
    }
}
