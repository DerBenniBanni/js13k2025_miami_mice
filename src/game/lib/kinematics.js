import { GameObject } from "./gameobject.js";
import { ctxBeginPath, ctxEllipse, ctxFill, ctxFillStyle, toRad } from "./utils.js";

export const POSE_STAND = 1;
export const POSE_WALK_1 = 2;
export const POSE_WALK_2 = 3;
export const POSE_PUNCH = 4;
export const POSE_PUNCH2 = 5;
export const POSE_KICK = 6;
export const POSE_BOW = 7;
export const POSE_BLOCK = 8;
export const STATE_IDLE = 1;
export const STATE_WALKING = 2;
export const STATE_BLOCK = 3;
export const STATE_PUNCH = 4;
export const STATE_KICK = 5;

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


export class KinematicObject extends GameObject {
    constructor(x,y, type = "kinematicObject") {
        super(x,y, type);
        this.rootBone = new Bone(0, 0, this);
        this.bones = [];
        this.lastMorph = {poseName: null, duration: 1};
        this.morphQueue = [];
        this.morphFrom = [];
        this.morphTo = [];
        this.morphDuration = 1; // seconds
        this.morphTimer = 0;
        this.invertX = false;
        this.state = STATE_IDLE;
        this.subState = 0;
        this.sizing = 1;
        this.lastPunch = 0;
        this.poseDefs = [[]];
        this.tailWiggle = [];
        this.walkSpeed = 100; // pixels per second)
    }

    addBone(id, length, angle, parentId = BONE_ROOT) {
        let bone = new Bone(length * this.sizing, angle, this);
        this.bones[id] = bone;
        this.bones[parentId].addChild(bone);
    }

    updateSizing() {
        this.sizing = this.y / 1080;;
    }   

    updateAngles() {
        this.rootBone.x = 0;
        this.rootBone.y = 0;
        this.rootBone.calculateEndPosition(this.sizing);
    }

    
    getPoseDefinition(poseName) {
        return [];
    }
    
    pose(poseName) {
        const poseDef = this.poseDefs[poseName];
        for (let i = 0; i < poseDef.length; i++) {
            this.bones[i].angle = toRad(poseDef[i]);
        }
        this.updateAngles();
    }

    morph(poseName, duration) {
        this.lastMorph = { poseName, duration };
        this.morphFrom = this.bones.map(bone => bone.angle);
        if(poseName) {
            this.morphTo = this.poseDefs[poseName].map(angle => toRad(angle));
            if(poseName === POSE_PUNCH) {
                this.lastPunch = 1;
            } else if(poseName === POSE_PUNCH2) {
                this.lastPunch = 2;
            }
        } else {
            // wiggle the tail
            this.morphTo = this.bones.map(bone => bone.angle);
        }
        this.tailWiggle.forEach(part => {
            this.morphTo[part[0]] = toRad(part[1] + Math.random() * part[2]);
        });
        this.morphDuration = duration;
        this.morphTimer = duration;
    }

    clearMorph() {
        this.morphQueue = [];
    }

    queueMorph(poseName, duration, immediate = false) {
        if (immediate) {
            this.clearMorph();
            this.morphTimer = 0
        }
        this.morphQueue.push({ poseName, duration });
        if (this.morphTimer <= 0) {
            const nextMorph = this.morphQueue.shift();
            this.morph(nextMorph.poseName, nextMorph.duration);
        }
    }

    update(delta) {
        if(this.kiUpdate) {
            this.kiUpdate(delta);
        }
        if(this.morphTimer > 0) {
            for(let i = 0; i < this.morphFrom.length; i++) {
                let step = ((this.morphTo[i]+100)-(this.morphFrom[i]+100)) / (this.morphDuration / delta);
                this.bones[i].angle += step;
            }
            this.updateAngles();
            this.morphTimer -= delta;
            if(this.morphTimer <= 0) {
                if(this.morphQueue.length > 0) {
                    const nextMorph = this.morphQueue.shift();
                    this.morph(nextMorph.poseName, nextMorph.duration);
                }
            }
        }
        if(this.morphQueue.length === 0) {
            if(this.state === STATE_WALKING) {
                let poseName = this.lastMorph.poseName == POSE_WALK_2 ? POSE_WALK_1 : POSE_WALK_2;
                this.queueMorph(poseName, 100 / this.walkSpeed);
            } else {
                this.queueMorph(null, 1);
            }
        }
    }

    renderShadow(ctx, x, y, w, h) {
        ctx.save();
        ctxFillStyle(ctx, "#0001");
        
        [1,0.8,0.6,0.4].forEach(scale => {
            ctxBeginPath(ctx);
            ctxEllipse(ctx, x, y, w * scale * this.sizing, h * scale * this.sizing, 0, 0, 2 * Math.PI);
            ctxFill(ctx);
        });
        ctx.restore();
    }
}

