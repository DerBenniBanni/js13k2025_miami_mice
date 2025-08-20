import { Cat } from "./cat.js";
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
        if (this.game.getActionState(ACTION_MOVE_LEFT_PLAYER_1)) {
            this.x -= 100 * deltaTime;
        }
        if (this.game.getActionState(ACTION_MOVE_RIGHT_PLAYER_1)) {
            this.x += 100 * deltaTime;
        }
        super.update(deltaTime);
    }
}
