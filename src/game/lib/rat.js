import { clamp, ctxArc, ctxBeginPath, ctxBezierCurveTo, ctxEllipse, ctxFill, ctxFillStyle, ctxLineTo, ctxLineWidth, ctxMoveTo, ctxStroke, ctxStrokeStyle, toRad } from "./utils.js";
import { Bone, Hitbox, HITBOX_TYPE_ATTACK, HITBOX_TYPE_LOWER, HITBOX_TYPE_UPPER, KinematicObject, POSE_BLOCK, POSE_BOW, POSE_CHECK_ATTACK, POSE_HIT_BODY, POSE_HIT_HEAD, POSE_KICK_A, POSE_KICK_B, POSE_KO, POSE_PUNCH, POSE_PUNCH2, POSE_STAND, POSE_TALK, POSE_THROW_1, POSE_THROW_2, POSE_THROW_EXECUTE, POSE_WALK_1, POSE_WALK_2, STATE_IDLE, STATE_KICK, STATE_KO, STATE_PUNCH, STATE_THROW, STATE_WALKING } from "./kinematics.js";
import { Projectile } from "./projectile.js";

const headsize = 40;

const BONE_ROOT = 0;
const BONE_UPPER_LEG_LEFT = 1;
const BONE_LOWER_LEG_LEFT = 2;
const BONE_UPPER_LEG_RIGHT = 3;
const BONE_LOWER_LEG_RIGHT = 4;
const BONE_BODY = 5;
const BONE_SHOULDER_LEFT = 6;
const BONE_ARM_LEFT = 7;
const BONE_FOREARM_LEFT = 8;
const BONE_SHOULDER_RIGHT = 9;
const BONE_ARM_RIGHT = 10;
const BONE_FOREARM_RIGHT = 11;
const BONE_NECK = 12;
const BONE_FACE = 13;
const BONE_NOSE = 14;
const BONE_EAR1 = 15;
const BONE_EAR2 = 16;
const BONE_EYE1 = 17;
const BONE_EYE2 = 18;
const BONE_TAIL1 = 19;
const BONE_TAIL2 = 20;
const BONE_TAIL3 = 21;

const POSE_STAND_DATA = [];
POSE_STAND_DATA[BONE_ROOT] = -90;
POSE_STAND_DATA[BONE_UPPER_LEG_LEFT] = 150;
POSE_STAND_DATA[BONE_LOWER_LEG_LEFT] = 30;
POSE_STAND_DATA[BONE_UPPER_LEG_RIGHT] = 190;
POSE_STAND_DATA[BONE_LOWER_LEG_RIGHT] = 20;
POSE_STAND_DATA[BONE_BODY] = 10;
POSE_STAND_DATA[BONE_SHOULDER_LEFT] = 100;
POSE_STAND_DATA[BONE_ARM_LEFT] = 40;
POSE_STAND_DATA[BONE_FOREARM_LEFT] = -100;
POSE_STAND_DATA[BONE_SHOULDER_RIGHT] = -100;
POSE_STAND_DATA[BONE_ARM_RIGHT] = -50;
POSE_STAND_DATA[BONE_FOREARM_RIGHT] = -100;
POSE_STAND_DATA[BONE_NECK] = 8;
POSE_STAND_DATA[BONE_FACE] = 30;
POSE_STAND_DATA[BONE_NOSE] = 90;
POSE_STAND_DATA[BONE_EAR1] = 0;
POSE_STAND_DATA[BONE_EAR2] = -40;
POSE_STAND_DATA[BONE_EYE1] = 65;
POSE_STAND_DATA[BONE_EYE2] = 62;

const POSE_WALK_1_DATA = [...POSE_STAND_DATA];
POSE_WALK_1_DATA[BONE_UPPER_LEG_LEFT] = 150;
POSE_WALK_1_DATA[BONE_LOWER_LEG_LEFT] = 30;
POSE_WALK_1_DATA[BONE_UPPER_LEG_RIGHT] = 190;
POSE_WALK_1_DATA[BONE_LOWER_LEG_RIGHT] = 20;

const POSE_WALK_2_DATA = [...POSE_STAND_DATA];
POSE_WALK_2_DATA[BONE_UPPER_LEG_LEFT] = 190;
POSE_WALK_2_DATA[BONE_LOWER_LEG_LEFT] = 20;
POSE_WALK_2_DATA[BONE_UPPER_LEG_RIGHT] = 150;
POSE_WALK_2_DATA[BONE_LOWER_LEG_RIGHT] = 30;

const POSE_PUNCH_DATA = [...POSE_STAND_DATA];
POSE_PUNCH_DATA[BONE_ARM_LEFT] = -15;
POSE_PUNCH_DATA[BONE_FOREARM_LEFT] = -10;
POSE_PUNCH_DATA[BONE_UPPER_LEG_LEFT] = 160;
POSE_PUNCH_DATA[BONE_LOWER_LEG_LEFT] = 40;
POSE_PUNCH_DATA[BONE_UPPER_LEG_RIGHT] = 200;

const POSE_PUNCH2_DATA = [...POSE_STAND_DATA];
POSE_PUNCH2_DATA[BONE_ARM_LEFT] = 110;
POSE_PUNCH2_DATA[BONE_FOREARM_LEFT] = -90;
POSE_PUNCH2_DATA[BONE_ARM_RIGHT] = -160;
POSE_PUNCH2_DATA[BONE_FOREARM_RIGHT] = -10;
POSE_PUNCH2_DATA[BONE_UPPER_LEG_LEFT] = 160;
POSE_PUNCH2_DATA[BONE_LOWER_LEG_LEFT] = 40;
POSE_PUNCH2_DATA[BONE_UPPER_LEG_RIGHT] = 200;

const POSE_KICK_A_DATA = [...POSE_STAND_DATA];
POSE_KICK_A_DATA[BONE_UPPER_LEG_LEFT] = 40;
POSE_KICK_A_DATA[BONE_LOWER_LEG_LEFT] = 90;
POSE_KICK_A_DATA[BONE_BODY] = -40;
POSE_KICK_A_DATA[BONE_UPPER_LEG_RIGHT] = 185;
POSE_KICK_A_DATA[BONE_ARM_LEFT] = 80;
POSE_KICK_A_DATA[BONE_FOREARM_LEFT] = -150;
POSE_KICK_A_DATA[BONE_ARM_RIGHT] = -0;
POSE_KICK_A_DATA[BONE_FOREARM_RIGHT] = -130;

const POSE_KICK_B_DATA = [...POSE_STAND_DATA];
POSE_KICK_B_DATA[BONE_UPPER_LEG_LEFT] = 90;
POSE_KICK_B_DATA[BONE_LOWER_LEG_LEFT] = 10;
POSE_KICK_B_DATA[BONE_BODY] = -40;
POSE_KICK_B_DATA[BONE_UPPER_LEG_RIGHT] = 185;
POSE_KICK_B_DATA[BONE_ARM_LEFT] = 80;
POSE_KICK_B_DATA[BONE_FOREARM_LEFT] = -150;
POSE_KICK_B_DATA[BONE_ARM_RIGHT] = -0;
POSE_KICK_B_DATA[BONE_FOREARM_RIGHT] = -130;

const POSE_BOW_DATA = [...POSE_STAND_DATA];
POSE_BOW_DATA[BONE_BODY] = 60;
POSE_BOW_DATA[BONE_ARM_LEFT] = 50;
POSE_BOW_DATA[BONE_ARM_RIGHT] = -130;
POSE_BOW_DATA[BONE_NECK] = 40;
POSE_BOW_DATA[BONE_UPPER_LEG_RIGHT] = 170;

const POSE_BLOCK_DATA = [...POSE_STAND_DATA];
POSE_BLOCK_DATA[BONE_ARM_LEFT] = 0;
POSE_BLOCK_DATA[BONE_FOREARM_LEFT] = -100;
POSE_BLOCK_DATA[BONE_ARM_RIGHT] = -30;
POSE_BLOCK_DATA[BONE_FOREARM_RIGHT] = -50;
POSE_BLOCK_DATA[BONE_UPPER_LEG_LEFT] = 110;
POSE_BLOCK_DATA[BONE_LOWER_LEG_LEFT] = 70;
POSE_BLOCK_DATA[BONE_UPPER_LEG_RIGHT] = 180;
POSE_BLOCK_DATA[BONE_LOWER_LEG_RIGHT] = 20;


const POSE_HIT_BODY_DATA = [...POSE_STAND_DATA];
POSE_HIT_BODY_DATA[BONE_ROOT] = -110;
POSE_HIT_BODY_DATA[BONE_BODY] = 30;
POSE_HIT_BODY_DATA[BONE_NECK] = 30;

const POSE_HIT_HEAD_DATA = [...POSE_STAND_DATA];
POSE_HIT_HEAD_DATA[BONE_BODY] = -15;
POSE_HIT_HEAD_DATA[BONE_NECK] = -15;

const POSE_KO_DATA = [...POSE_STAND_DATA];
POSE_KO_DATA[BONE_ROOT] = -170;
POSE_KO_DATA[BONE_BODY] = -10;
POSE_KO_DATA[BONE_NECK] = -30;
POSE_KO_DATA[BONE_UPPER_LEG_LEFT] = 170;
POSE_KO_DATA[BONE_ARM_LEFT] = -80;
POSE_KO_DATA[BONE_FOREARM_LEFT] = -40;
POSE_KO_DATA[BONE_ARM_RIGHT] = -20;
POSE_KO_DATA[BONE_FOREARM_RIGHT] = -60;


const POSE_THROW_1_DATA = [...POSE_STAND_DATA];
POSE_THROW_1_DATA[BONE_ARM_LEFT] = -140;
POSE_THROW_1_DATA[BONE_FOREARM_LEFT] = 20;
POSE_THROW_1_DATA[BONE_ARM_RIGHT] = -120;
POSE_THROW_1_DATA[BONE_FOREARM_RIGHT] = -30;


const POSE_THROW_2_DATA = [...POSE_STAND_DATA];
POSE_THROW_2_DATA[BONE_ARM_LEFT] = -10;
POSE_THROW_2_DATA[BONE_FOREARM_LEFT] = -10;
POSE_THROW_2_DATA[BONE_ARM_RIGHT] = -20;
POSE_THROW_2_DATA[BONE_FOREARM_RIGHT] = -120;

const LINE_ROUND = "round";
const LINE_BUTT = "butt";

const FURCOLORS = ["#462626","#777","#494034"];
const GIOLORS = ["#000","#010","#100","#002"];

const ATTACKS = {
    "PUNCH": {state: STATE_PUNCH, poses: [[POSE_PUNCH, 0.2]]},
    "KICK": {state: STATE_KICK, poses: [[POSE_KICK_A, 0.2], [POSE_KICK_B, 0.2]]},
    "PUNCH2": {state: STATE_PUNCH, poses: [[POSE_PUNCH2, 0.2]]}
};

export class Rat extends KinematicObject {
    constructor(x,y,type = "rat") {
        super(x,y,type);
        this.giColors = [GIOLORS[Math.floor(Math.random()*GIOLORS.length)], '#333'];
        this.fur = FURCOLORS[Math.floor(Math.random()*FURCOLORS.length)];
        this.walkSpeed = 120 + Math.random()*60;
        this.renderEars = true;
        this.isThrower = false;

        this.hp = 100;

        this.poseDefs[POSE_STAND] = POSE_STAND_DATA;
        this.poseDefs[POSE_WALK_1] = POSE_WALK_1_DATA;
        this.poseDefs[POSE_WALK_2] = POSE_WALK_2_DATA;
        this.poseDefs[POSE_PUNCH] = POSE_PUNCH_DATA;
        this.poseDefs[POSE_PUNCH2] = POSE_PUNCH2_DATA;
        this.poseDefs[POSE_KICK_A] = POSE_KICK_A_DATA;
        this.poseDefs[POSE_KICK_B] = POSE_KICK_B_DATA;
        this.poseDefs[POSE_BOW] = POSE_BOW_DATA;
        this.poseDefs[POSE_BLOCK] = POSE_BLOCK_DATA;
        this.poseDefs[POSE_HIT_BODY] = POSE_HIT_BODY_DATA;
        this.poseDefs[POSE_HIT_HEAD] = POSE_HIT_HEAD_DATA;
        this.poseDefs[POSE_KO] = POSE_KO_DATA;
        this.poseDefs[POSE_TALK] = POSE_STAND_DATA;
        this.poseDefs[POSE_THROW_1] = POSE_THROW_1_DATA;
        this.poseDefs[POSE_THROW_2] = POSE_THROW_2_DATA;

        this.attackFrequency = 1.5; // 2 seconds
        this.attackDuration = 0.5; // 0.5 seconds
        this.attackTimer = 1.3;
        this.attackPoseIdx = 0;
        this.attackPattern = ["PUNCH","KICK","PUNCH2","PUNCH","KICK"];

        this.tailWiggle = [
            [BONE_TAIL1, -130, 80],
            [BONE_TAIL2, -60, 120],
            [BONE_TAIL3, -60, 120]
        ];
        this.createBones();
        this.updateSizing();
    }

    createBones() {
        this.rootBone = new Bone(155, -90, this);
        this.bones[BONE_ROOT] = this.rootBone;
        this.addBone(BONE_UPPER_LEG_LEFT, 90, toRad(60), BONE_ROOT);
        this.addBone(BONE_LOWER_LEG_LEFT, 60, toRad(30), BONE_UPPER_LEG_LEFT)
            .addHitboxEnd(new Hitbox(0, 0, 40, 40, HITBOX_TYPE_ATTACK));
        this.addBone(BONE_UPPER_LEG_RIGHT, 90, toRad(100), BONE_ROOT);
        this.addBone(BONE_LOWER_LEG_RIGHT, 60, toRad(20), BONE_UPPER_LEG_RIGHT);
        this.addBone(BONE_BODY, 80, toRad(-100), BONE_ROOT)
            .addHitboxStart(new Hitbox(0, 0, 100, 100, HITBOX_TYPE_LOWER, POSE_HIT_BODY));
        this.addBone(BONE_NECK, headsize, toRad(-10), BONE_BODY)
            .addHitboxEnd(new Hitbox(0, 0, 100, 80, HITBOX_TYPE_UPPER, POSE_HIT_HEAD));
        this.addBone(BONE_SHOULDER_LEFT, 10, toRad(80), BONE_BODY);
        this.addBone(BONE_ARM_LEFT, 80, toRad(40), BONE_SHOULDER_LEFT);
        this.addBone(BONE_FOREARM_LEFT, 80, toRad(-100), BONE_ARM_LEFT)
            .addHitboxEnd(new Hitbox(0, 0, 40, 40, HITBOX_TYPE_ATTACK));
        this.addBone(BONE_SHOULDER_RIGHT, 10, toRad(-100), BONE_BODY);
        this.addBone(BONE_ARM_RIGHT, 80, toRad(-30), BONE_SHOULDER_RIGHT);
        this.addBone(BONE_FOREARM_RIGHT, 80, toRad(-90), BONE_ARM_RIGHT)
            .addHitboxEnd(new Hitbox(0, 0, 40, 40, HITBOX_TYPE_ATTACK));
        this.addBone(BONE_FACE, headsize*0.55, toRad(0), BONE_NECK);
        this.addBone(BONE_NOSE, headsize*2.5, toRad(0), BONE_NECK);
        this.addBone(BONE_EAR1, headsize*1.2, toRad(0), BONE_NECK);
        this.addBone(BONE_EAR2, headsize*1.2, toRad(-20), BONE_NECK);
        this.addBone(BONE_EYE1, headsize*0.95, toRad(70), BONE_NECK);
        this.addBone(BONE_EYE2, headsize*0.75, toRad(65), BONE_NECK);

        this.addBone(BONE_TAIL1, 60, toRad(-90), BONE_ROOT);
        this.addBone(BONE_TAIL2, 60, toRad(45), BONE_TAIL1);
        this.addBone(BONE_TAIL3, 60, toRad(-45), BONE_TAIL2);

        this.pose(POSE_STAND);
        this.updateAngles();
    }

    kiUpdate(delta) {
        let lastState = this.state;
        if(this.state === STATE_KO) {
            return;
        }
        if(this.game.cutsceneRunning) {
            this.kiWalk(delta);
            return;
        } 
        if(this.kiTarget == null) {
            let targets = this.game.getGameObjects(["cat", "player"]);
            this.kiTarget = targets[Math.floor(Math.random() * targets.length)];
        } else {
            this.attackTimer += delta;
            let distanceX = this.kiTarget.x - this.x;
            let distanceY = Math.abs(this.kiTarget.y - this.y);
            let distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
            this.invertX = distanceX < 0;
            if (distance < 200 * this.sizing && distanceY < 9) {
                if (this.attackTimer > this.attackFrequency) {
                    this.attackTimer = 0;
                    this.attackPoseIdx = (this.attackPoseIdx + 1) % this.attackPattern.length;
                    let attack = ATTACKS[this.attackPattern[this.attackPoseIdx]];
                    this.state = attack.state;
                    attack.poses.forEach(pose => {
                        this.queueMorph(pose[0], pose[1]);
                    });
                    this.queueMorph(POSE_CHECK_ATTACK, 0);
                    this.queueMorph(POSE_STAND, 0.2);
                }
                
            } else if(distanceY < 30 && Math.abs(distanceX) > 300 * this.sizing && this.isThrower) {
                if (this.attackTimer > this.attackFrequency) {
                    this.attackTimer = 0;
                    this.state = STATE_THROW;
                    this.queueMorph(POSE_THROW_1, 0.5, true);
                    this.queueMorph(POSE_THROW_2, 0.2);
                    this.queueMorph(POSE_THROW_EXECUTE, 0);
                }
            } else {
                // Move towards the target
                this.kiWalk(delta);
            }
        }
    }

    renderRat(bone, ctx, renderChildren = true) {
        ctxStrokeStyle(ctx, this.fur);
        ctxLineWidth(ctx, 40 * this.sizing);
        ctx.lineCap = "round";
        ctxBeginPath(ctx);
        ctxMoveTo(ctx, bone.x, bone.y);
        ctxLineTo(ctx, bone.endX, bone.endY);
        ctxStroke(ctx);
        // Render children
        if(renderChildren) {
            for (const child of bone.children) {
                this.renderRat(child, ctx, true);
            }
        }
    }
    renderSuit(bone, ctx, renderChildren = true, scale = 1) {
        [[50,this.giColors[1],LINE_BUTT],[48,this.giColors[0], LINE_ROUND]].forEach(([linewidth, color, lineCap]) => {
            linewidth = linewidth * scale;
            this.renderBoneLine(bone, ctx, linewidth * this.sizing, color, lineCap, renderChildren);
        });
    }

    renderBoneLine(bone, ctx, width, color, lineCap, renderChildren = true) {
        ctxStrokeStyle(ctx, color);
        ctxLineWidth(ctx, width);
        ctx.lineCap = lineCap ? lineCap : LINE_ROUND;
        if(bone.children.length == 0) {
            ctx.lineCap = LINE_BUTT;
        }
        ctxBeginPath(ctx);
        ctxMoveTo(ctx, bone.x, bone.y);
        ctxLineTo(ctx, bone.endX, bone.endY);
        ctxStroke(ctx);
        if(renderChildren) {
            for (const child of bone.children) {
                this.renderBoneLine(child, ctx, width, color, renderChildren);
            }
        }
    }

    renderShadow(ctx) {
        super.renderShadow(ctx, this.bones[BONE_ROOT].x, this.bones[BONE_ROOT].y, 90, 15);
    }

    render(ctx) {
        
        ctx.save();
        if(this.fadeTimer > this.fadeTimeout) {
            ctx.globalAlpha = clamp(1 - (this.fadeTimer - this.fadeTimeout) / this.fadeDuration, 0, 1);
        }
        ctx.translate(this.x, this.y);
        this.renderShadow(ctx);
        this.renderRat(this.bones[BONE_SHOULDER_LEFT], ctx);
        this.renderSuit(this.bones[BONE_SHOULDER_LEFT], ctx);

        this.renderRat(this.bones[BONE_UPPER_LEG_LEFT], ctx);
        this.renderSuit(this.bones[BONE_UPPER_LEG_LEFT], ctx);

        //tail
        ctxStrokeStyle(ctx, this.fur);
        ctxLineWidth(ctx, 15 * this.sizing);
        ctx.lineCap = "round";
        ctxBeginPath(ctx);
        ctxMoveTo(ctx, this.bones[BONE_TAIL1].x, this.bones[BONE_TAIL1].y);
        ctxBezierCurveTo(ctx,
            this.bones[BONE_TAIL2].x, this.bones[BONE_TAIL2].y, 
            this.bones[BONE_TAIL3].x, this.bones[BONE_TAIL3].y, 
            this.bones[BONE_TAIL3].endX, this.bones[BONE_TAIL3].endY
        );
        ctxStroke(ctx);

        this.renderSuit(this.bones[BONE_BODY], ctx, false, 1.8);
        
        this.renderRat(this.bones[BONE_UPPER_LEG_RIGHT], ctx);
        this.renderSuit(this.bones[BONE_UPPER_LEG_RIGHT], ctx);

        this.renderRat(this.bones[BONE_SHOULDER_RIGHT], ctx);
        this.renderSuit(this.bones[BONE_SHOULDER_RIGHT], ctx);
        
       
        // ear1
        if(this.renderEars) {
            ctxFillStyle(ctx, this.fur);
            ctxBeginPath(ctx);
            ctxArc(ctx, this.bones[BONE_EAR1].endX, this.bones[BONE_EAR1].endY, headsize * this.sizing*0.6, 0, 2 * Math.PI);
            ctxFill(ctx);
        }

        // Head
        ctxFillStyle(ctx, this.fur);
        let neck = this.bones[BONE_NECK];
        ctxBeginPath(ctx);
        ctxArc(ctx, neck.endX, neck.endY, headsize * this.sizing, 0, 2 * Math.PI);
        ctxFill(ctx);
        // Face
        ctxFillStyle(ctx, this.fur);
        ctxBeginPath(ctx);
        ctxMoveTo(ctx, this.bones[BONE_FACE].endX, this.bones[BONE_FACE].endY);
        ctxLineTo(ctx, this.bones[BONE_NOSE].endX, this.bones[BONE_NOSE].endY);
        ctxLineTo(ctx, this.bones[BONE_NECK].x, this.bones[BONE_NECK].y);
        ctxFill(ctx);
        // Nose
        ctxFillStyle(ctx, "#844");
        ctxBeginPath(ctx);
        ctxArc(ctx, this.bones[BONE_NOSE].endX, this.bones[BONE_NOSE].endY, 5 * this.sizing, 0, 2 * Math.PI);
        ctxFill(ctx);
        // ear2
        if(this.renderEars) {
            ctxFillStyle(ctx, this.fur);
            ctxBeginPath(ctx);
            ctxArc(ctx, this.bones[BONE_EAR2].endX, this.bones[BONE_EAR2].endY, headsize * this.sizing*0.6, 0, 2 * Math.PI);
            ctxFill(ctx);
            ctxFillStyle(ctx, "#844");
            ctxBeginPath(ctx);
            ctxArc(ctx, this.bones[BONE_EAR2].endX, this.bones[BONE_EAR2].endY, headsize * this.sizing*0.5, 0, 2 * Math.PI);
            ctxFill(ctx);
        }
        //eyes
        [BONE_EYE1, BONE_EYE2].forEach((boneId) => {
            ctxBeginPath(ctx);
            ctxFillStyle(ctx, "#f00");
            ctxArc(ctx, this.bones[boneId].endX, this.bones[boneId].endY, 3 * this.sizing, 0, 2 * Math.PI);
            ctxFill(ctx);
        });
        this.renderHitboxes(ctx);
        this.renderSpecials(ctx);
        ctx.restore();
        this.renderParticles(ctx);
        
    }
    renderSpecials(ctx) {
        // Render special effects or features unique to the rat type
    }


    handleThrow() {
        let x = this.bones[BONE_FOREARM_LEFT].endX + this.x;
        let y = this.y;
        let h = this.bones[BONE_FOREARM_LEFT].endY;
        let dx = 300 * (this.invertX ? -1 : 1);
        let dy = 0;
        this.game.addGameObject(new Projectile(x, y, h, dx, dy, this));
    }
}