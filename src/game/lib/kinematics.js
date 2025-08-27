import { GameObject } from "./gameobject.js";
import { ctxBeginPath, ctxEllipse, ctxFill, ctxFillStyle, ctxRect, ctxStroke, ctxStrokeStyle, toRad } from "./utils.js";

export const POSE_STAND = 1;
export const POSE_WALK_1 = 2;
export const POSE_WALK_2 = 3;
export const POSE_PUNCH = 4;
export const POSE_PUNCH2 = 5;
export const POSE_KICK_A = 6;
export const POSE_KICK_B = 7;
export const POSE_BOW = 8;
export const POSE_BLOCK = 9;
export const POSE_CHECK_ATTACK = 10;
export const POSE_HIT_HEAD = 11;
export const POSE_HIT_BODY = 12;

export const STATE_IDLE = 1;
export const STATE_WALKING = 2;
export const STATE_BLOCK = 3;
export const STATE_PUNCH = 4;
export const STATE_KICK = 5;

export const HITBOX_TYPE_UPPER = 1;
export const HITBOX_TYPE_LOWER = 2;
export const HITBOX_TYPE_ATTACK = 3;


export class Hitbox {
    constructor(x, y, width, height, type, poseId = null) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.bone = null;
        this.type = type;
        this.poseId = poseId;
    }

    getRect() {
        let w = this.width * this.bone.kinematicObject.sizing;
        let h = this.height * this.bone.kinematicObject.sizing;
        return {
            x: this.x - w / 2,
            y: this.y - h / 2,
            w: w,
            h: h
        };
    }

    getWorldRect() {
        if (!this.bone) return this.getRect();
        let rect = this.getRect();
        let obj = this.bone.kinematicObject;
        rect.x += obj.x;
        rect.y += obj.y;
        return rect;
    }   

    intersects(other) {
        let rect1 = this.getWorldRect();
        let rect2 = other.getWorldRect();
        return (
            rect1.x < rect2.x + rect2.w &&
            rect1.x + rect1.w > rect2.x &&
            rect1.y < rect2.y + rect2.h &&
            rect1.y + rect1.h > rect2.y
        );
    }

    render(ctx) {
        /*
        let rect = this.getRect();
        let color="#ff02";
        if(this.type == HITBOX_TYPE_ATTACK) color="#f002";
        ctxFillStyle(ctx, color);
        ctxBeginPath(ctx);
        ctxRect(ctx, rect.x, rect.y, rect.w, rect.h);
        ctxFill(ctx);
        */
    }
}

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
        this.hitboxStart = null;
        this.hitboxEnd = null;
        this.calculateEndPosition(1);
    }

    addHitboxStart(hitbox) {
        hitbox.bone = this;
        this.kinematicObject.hitboxes.push(hitbox);
        this.hitboxStart = hitbox;
        return this;
    }

    addHitboxEnd(hitbox) {
        hitbox.bone = this;
        this.kinematicObject.hitboxes.push(hitbox);
        this.hitboxEnd = hitbox;
        return this;
    }

    addChild(childBone) {
        childBone.parent = this;
        this.children.push(childBone);
    }

    calculateEndPosition(sizing, parentAngle = 0) {
        // Update starthitbox position
        if(this.hitboxStart) {
            this.hitboxStart.x = this.x;
            this.hitboxStart.y = this.y;
        }
        this.worldAngle = this.angle + parentAngle;
        if (this.kinematicObject && this.kinematicObject.invertX) {
            // Update bone position based on angle and length
            this.endX = this.x - Math.cos(this.worldAngle) * this.length * sizing;
        } else {
            // Update bone position based on angle and length
            this.endX = this.x + Math.cos(this.worldAngle) * this.length * sizing;
        }
        this.endY = this.y + Math.sin(this.worldAngle) * this.length * sizing;
        // Update end-hitbox position
        if(this.hitboxEnd) {
            this.hitboxEnd.x = this.endX;
            this.hitboxEnd.y = this.endY;
        }
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
        this.lastMorph = {poseId: null, duration: 1};
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
        this.walkSpeed = 100; // pixels per second
        this.hitboxes = [];
    }

    getHitboxes(attack = false) {
        return this.hitboxes.filter(h => attack ? h.type == HITBOX_TYPE_ATTACK : h.type != HITBOX_TYPE_ATTACK);
    }


    addBone(id, length, angle, parentId = BONE_ROOT) {
        let bone = new Bone(length * this.sizing, angle, this);
        this.bones[id] = bone;
        this.bones[parentId].addChild(bone);
        return bone;
    }

    updateSizing() {
        this.sizing = this.y / 1080;;
    }   

    updateAngles() {
        this.rootBone.x = 0;
        this.rootBone.y = 0;
        this.rootBone.calculateEndPosition(this.sizing);
    }

    
    getPoseDefinition(poseId) {
        return [];
    }
    
    pose(poseId) {
        const poseDef = this.poseDefs[poseId];
        for (let i = 0; i < poseDef.length; i++) {
            this.bones[i].angle = toRad(poseDef[i]);
        }
        this.updateAngles();
    }

    morph(poseId, duration) {
        this.lastMorph = { poseId, duration };
        this.morphFrom = this.bones.map(bone => bone.angle);
        if(poseId) {
            this.morphTo = this.poseDefs[poseId].map(angle => toRad(angle));
            if(poseId === POSE_PUNCH) {
                this.lastPunch = 1;
            } else if(poseId === POSE_PUNCH2) {
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

    queueMorph(poseId, duration, immediate = false) {
        if (immediate) {
            this.clearMorph();
            this.morphTimer = 0
        }
        this.morphQueue.push({ poseId, duration });
        if (this.morphTimer <= 0) {
            const nextMorph = this.morphQueue.shift();
            this.morph(nextMorph.poseId, nextMorph.duration);
        }
    }

    update(delta) {
        if(this.kiUpdate) {
            this.kiUpdate(delta);
        }
        if(this.morphTimer > 0) {
            if(this.morphTimer < delta) {
                delta = this.morphTimer;
            }
            for(let i = 0; i < this.morphFrom.length; i++) {
                let step = ((this.morphTo[i]+100)-(this.morphFrom[i]+100)) / (this.morphDuration / delta);
                this.bones[i].angle += step;
            }
            this.updateAngles();
            this.morphTimer -= delta;
            if(this.morphTimer <= 0) {
                if(this.morphQueue.length > 0) {
                    const nextMorph = this.morphQueue.shift();
                    if(nextMorph.poseId == POSE_CHECK_ATTACK) {
                        this.checkAttackHitboxes();
                    } else {
                        this.morph(nextMorph.poseId, nextMorph.duration);
                    }
                }
            }
        }
        if(this.morphQueue.length === 0) {
            if(this.state === STATE_WALKING) {
                let poseId = this.lastMorph.poseId == POSE_WALK_2 ? POSE_WALK_1 : POSE_WALK_2;
                this.queueMorph(poseId, 100 / this.walkSpeed);
            } else {
                this.queueMorph(null, 1);
            }
        }
    }

    checkAttackHitboxes() {
        let activeAttackHitboxes = this.getHitboxes(true);
        if (activeAttackHitboxes.length > 0) {
            this.game.getGameObjects()
                .filter(obj => obj !== this && obj.y>this.y-30 && obj.y<this.y+30)
                .forEach(obj => {
                    let hitboxes = obj.getHitboxes();
                    hitboxes.forEach(hitbox => {
                        let hit = activeAttackHitboxes.find(activeHitbox => activeHitbox.intersects(hitbox))
                        if (hit) {
                            let direction = obj.x > this.x ? 1 : -1;
                            //obj.x += 50 * direction;
                            if(hitbox.poseId) {
                                obj.queueMorph(hitbox.poseId, 0.1, true);
                                obj.queueMorph(POSE_STAND, 0.2);
                            }
                        }
                    });
                });
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

    renderHitboxes(ctx) {
        this.hitboxes.forEach(hitbox => {
            hitbox.render(ctx);
        });
    }
}

