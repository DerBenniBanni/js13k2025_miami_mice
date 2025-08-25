import { ctxFillStyle } from "./utils.js";

export class GameObject {
    constructor(x, y, type = "gameObject") {
        this.x = x;
        this.y = y;
        this.game = null;
        this.type = type;
    }

    update(delta) {
        // Update the game object's position or state
    }

    render(ctx) {
        ctxFillStyle(ctx, "red");
        ctx.fillRect(this.x, this.y, 50, 50);
    }

    
}