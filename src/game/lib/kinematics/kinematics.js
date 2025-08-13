export class Bone {
    constructor(length, angle) {
        this.x = 0;
        this.y = 0;
        this.length = length;
        this.angle = angle; // Angle in radians
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
        // Update bone position based on angle and length
        this.endX = this.x + Math.cos(this.angle + parentAngle) * this.length;
        this.endY = this.y + Math.sin(this.angle + parentAngle) * this.length;
        // Update children's positions
        for (const child of this.children) {
            child.x = this.endX;
            child.y = this.endY;
            child.calculateEndPosition(this.angle + parentAngle);
        }
    }

    render(ctx) {
        ctx.strokeStyle = "black";
        ctx.lineWidth = 5;
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