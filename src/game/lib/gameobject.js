import { ctxFillStyle } from "./utils.js";

export class GameObject {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.game = null;
    }

    update(delta) {
        // Update the game object's position or state
    }

    render(ctx) {
        ctxFillStyle(ctx, "red");
        ctx.fillRect(this.x, this.y, 50, 50);
    }

    
}