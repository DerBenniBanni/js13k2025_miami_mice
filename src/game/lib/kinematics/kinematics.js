export class Bone {
    constructor(length, angle) {
        this.x = 0;
        this.y = 0;
        this.length = length;
        this.angle = angle; // Angle in radians
        this.worldAngle = 0;
        this.endX = 0;
        this.endY = 0;
        this.children = [];
        this.parent = null;
        this.calculateEndPosition();
    }

    addChild(childBone) {
        childBone.parent = this;
        this.children.push(childBone);
    }

    calculateEndPosition(parentAngle = 0) {
        
        this.worldAngle = this.angle + parentAngle;
        // Update bone position based on angle and length
        this.endX = this.x + Math.cos(this.worldAngle) * this.length;
        this.endY = this.y + Math.sin(this.worldAngle) * this.length;
        // Update children's positions
        for (const child of this.children) {
            child.x = this.endX;
            child.y = this.endY;
            child.calculateEndPosition(this.worldAngle);
        }
    }

    render(ctx) {
        ctx.strokeStyle = "black";
        ctx.lineWidth = 15;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.endX, this.endY);
        ctx.stroke();
        // Render children
        for (const child of this.children) {
            child.render(ctx);
        }
    }
}