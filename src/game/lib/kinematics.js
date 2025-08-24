export class Bone {
    constructor(length, angle, kinematicObject) {
        this.x = 0;
        this.y = 0;
        this.kinematicObject = kinematicObject; // Reference to the kinematic object this bone belongs to
        this.length = length;
        this.angle = angle; // Angle in radians
        this.worldAngle = 0;
        this.endX = 0;
        this.endY = 0;
        this.children = [];
        this.parent = null;
        this.calculateEndPosition(1);
    }

    addChild(childBone) {
        childBone.parent = this;
        this.children.push(childBone);
    }

    calculateEndPosition(sizing, parentAngle = 0) {
        
        this.worldAngle = this.angle + parentAngle;
        if (this.kinematicObject && this.kinematicObject.invertX) {
            // Update bone position based on angle and length
            this.endX = this.x - Math.cos(this.worldAngle) * this.length * sizing;
        } else {
            // Update bone position based on angle and length
            this.endX = this.x + Math.cos(this.worldAngle) * this.length * sizing;
        }
        this.endY = this.y + Math.sin(this.worldAngle) * this.length * sizing;
        // Update children's positions
        for (const child of this.children) {
            child.x = this.endX;
            child.y = this.endY;
            child.calculateEndPosition(sizing, this.worldAngle);
        }
    }

    render(ctx) {
        ctxStrokeStyle(ctx, "black");
        ctx.lineWidth = 15;
        ctx.lineCap = "round";
        ctxBeginPath(ctx)();
        ctxMoveTo(ctx, this.x, this.y);
        ctxLineTo(ctx, this.endX, this.endY);
        ctx.stroke();
        // Render children
        for (const child of this.children) {
            child.render(ctx);
        }
    }
}